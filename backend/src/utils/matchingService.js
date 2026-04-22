const stringSimilarity = require("string-similarity");
const ItemReport = require("../models/itemModel");
const Match = require("../models/matchModel");
const Notification = require("../models/notificationModel");
const { getUserEmail } = require("./clerkClient");
const { sendMatchEmail } = require("./emailService");

const MATCH_THRESHOLD = 0.50;

/**
 * Calculates a match score between two items.
 * 
 * Scoring weights (total = 1.0):
 *   Category match:  25%  (specific AI metadata — e.g. "Wallet", "Watch")
 *   Title similarity: 25%  (short, consistent AI-generated titles)
 *   Description sim:  10%  (long AI text can diverge — weighted lowest)
 *   Color match:      15%  (structured metadata)
 *   Location sim:     15%  (user-entered, usually consistent)
 *   Brand match:      10%  (structured metadata)
 * 
 * @param {Object} reportA - The new report
 * @param {Object} reportB - An existing report from DB
 * @returns {{ score: Number, breakdown: Object }}
 */
const calculateScore = (reportA, reportB) => {
  let score = 0;
  const breakdown = {};

  // 1. Category — HARD GATE: must match or reject
  const catA = (reportA.extractedDetails?.category || "").toLowerCase().trim();
  const catB = (reportB.extractedDetails?.category || "").toLowerCase().trim();

  if (catA && catB) {
    // Both have categories — use fuzzy match
    const catSimilarity = stringSimilarity.compareTwoStrings(catA, catB);
    breakdown.category = catSimilarity;
    if (catSimilarity >= 0.5) {
      score += 0.25;
    } else {
      breakdown.result = "REJECTED (category mismatch)";
      return { score: 0, breakdown };
    }
  } else {
    // One or both categories missing — use TITLE similarity as fallback gate
    // Titles like "Black Nike Wallet Lost" vs "Wristwatch Found" have very low similarity
    // so this prevents cross-category false positives
    const titleA = reportA.title.toLowerCase();
    const titleB = reportB.title.toLowerCase();
    const titleGate = stringSimilarity.compareTwoStrings(titleA, titleB);
    breakdown.category = `fallback-title-gate (${titleGate.toFixed(2)})`;
    if (titleGate >= 0.45) {
      score += 0.25; // Reward high title similarity as a proxy for same category
    } else {
      breakdown.result = `REJECTED (no category + low title similarity ${(titleGate * 100).toFixed(0)}%)`;
      return { score: 0, breakdown };
    }
  }

  // 2. Title Similarity (25%)
  const titleA = reportA.title.toLowerCase();
  const titleB = reportB.title.toLowerCase();
  const titleSim = stringSimilarity.compareTwoStrings(titleA, titleB);
  score += titleSim * 0.25;
  breakdown.title = titleSim;

  // 3. Description Similarity (10% — weighted low since AI rewrites diverge)
  const descA = reportA.description.toLowerCase();
  const descB = reportB.description.toLowerCase();
  const descSim = stringSimilarity.compareTwoStrings(descA, descB);
  score += descSim * 0.1;
  breakdown.description = descSim;

  // 4. Color Similarity (15%)
  const colorA = (reportA.extractedDetails?.color || "").toLowerCase();
  const colorB = (reportB.extractedDetails?.color || "").toLowerCase();
  if (colorA && colorB) {
    const colorSim = stringSimilarity.compareTwoStrings(colorA, colorB);
    score += colorSim * 0.15;
    breakdown.color = colorSim;
  } else {
    breakdown.color = "skipped (empty)";
  }

  // 5. Location similarity (15%)
  const locA = (reportA.location || "").toLowerCase();
  const locB = (reportB.location || "").toLowerCase();
  if (locA && locB) {
    const locSim = stringSimilarity.compareTwoStrings(locA, locB);
    score += locSim * 0.15;
    breakdown.location = locSim;
  } else {
    breakdown.location = "skipped (empty)";
  }

  // 6. Brand similarity (10%)
  const brandA = (reportA.extractedDetails?.brand || "").toLowerCase();
  const brandB = (reportB.extractedDetails?.brand || "").toLowerCase();
  if (brandA && brandB) {
    const brandSim = stringSimilarity.compareTwoStrings(brandA, brandB);
    score += brandSim * 0.1;
    breakdown.brand = brandSim;
  } else {
    breakdown.brand = "skipped (empty)";
  }

  const finalScore = Math.min(score, 1);
  breakdown.total = finalScore;
  return { score: finalScore, breakdown };
};

/**
 * Finds matches for a newly created report
 * @param {Object} newReport - The item report object
 */
const findMatches = async (newReport) => {
  try {
    const targetType = newReport.type === "lost" ? "found" : "lost";

    // Query all opposite-type active items from other users.
    const candidates = await ItemReport.find({
      type: targetType,
      userId: { $ne: newReport.userId },
      status: "active",
    }).lean();

    console.log(`[Match] Checking ${candidates.length} ${targetType} candidates for "${newReport.title}"`);

    for (const candidate of candidates) {
      const { score, breakdown } = calculateScore(newReport, candidate);

      // Log candidates that pass at least the category/title gate (score > 0)
      if (score > 0) {
        console.log(`[Match]   📊 "${newReport.title}" vs "${candidate.title}" → ${Math.round(score * 100)}%`, JSON.stringify(breakdown));
      }

      if (score >= MATCH_THRESHOLD) {
        // 1. Find or Create the Match
        const lostId = newReport.type === "lost" ? newReport._id : candidate._id;
        const foundId = newReport.type === "found" ? newReport._id : candidate._id;

        let match = await Match.findOne({ lostItemId: lostId, foundItemId: foundId });
        if (!match) {
          match = await Match.create({
            lostItemId: lostId,
            foundItemId: foundId,
            score: score,
            status: "pending",
          });
          console.log(`[Match] ✅ Created match (${Math.round(score * 100)}%): "${newReport.title}" ↔ "${candidate.title}"`);
        }

        // 2. Determine who is who
        const lostReport = newReport.type === "lost" ? newReport : candidate;
        const foundReport = newReport.type === "found" ? newReport : candidate;

        // 3. Notify both users with clear, role-specific messages
        const usersToNotify = [
          {
            userId: lostReport.userId,
            message: `🔍 Great news! A found item matching your lost "${lostReport.title}" was reported near ${foundReport.location}. Review your matches to check if it's yours.`,
          },
          {
            userId: foundReport.userId,
            message: `📦 Someone may be looking for the item you found: "${foundReport.title}". They reported losing a similar item. Check your matches to help connect them!`,
          },
        ];

        for (const entry of usersToNotify) {
          const existingNotif = await Notification.findOne({
            userId: entry.userId,
            relatedId: match._id,
            type: "match_found"
          });

          if (!existingNotif) {
            await Notification.create({
              userId: entry.userId,
              message: entry.message,
              type: "match_found",
              relatedId: match._id,
            });

            // Send email notification (background, non-blocking)
            getUserEmail(entry.userId).then(email => {
              if (email) {
                const itemDetails = entry.userId === lostReport.userId ? (typeof lostReport.toObject === 'function' ? lostReport.toObject() : lostReport) : (typeof foundReport.toObject === 'function' ? foundReport.toObject() : foundReport);
                const matchDetails = entry.userId === lostReport.userId ? (typeof foundReport.toObject === 'function' ? foundReport.toObject() : foundReport) : (typeof lostReport.toObject === 'function' ? lostReport.toObject() : lostReport);
                console.log(`[Email] Sending match email to ${email} for user ${entry.userId}`);
                sendMatchEmail(email, itemDetails, { ...matchDetails, score });
              } else {
                console.warn(`[Email] ⚠️ Could not fetch email for user ${entry.userId} — skipping email notification`);
              }
            }).catch(err => console.error(`[Email] ❌ Email processing error for user ${entry.userId}:`, err.message));
          }
        }
      }
    }

    return true;
  } catch (error) {
    console.error("[Match] Service Error:", error);
    return false;
  }
};

/**
 * Performs a deep scan of all active items for a user to find matches
 * @param {String} userId 
 */
const syncUserMatches = async (userId) => {
  try {
    const activeItems = await ItemReport.find({ userId, status: "active" });
    for (const item of activeItems) {
      await findMatches(item);
    }
    return true;
  } catch (error) {
    console.error("[Match] Sync Error:", error);
    return false;
  }
};

module.exports = { findMatches, syncUserMatches };
