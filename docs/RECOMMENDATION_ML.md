# Recommendation ML

The browser trains a per-account logistic ranker from explicit restaurant likes and passes. With both feedback classes, pairwise training learns relative preferences and a short batch pointwise pass preserves the overall balance of evidence. Without that second objective, identical features cancel in every pair: 90 likes and one pass incorrectly become neutral. When only one feedback class exists, it uses pointwise logistic learning. No external model service or new dependency is required.

Features include cuisine aliases, meaningful tags, ambience, occasion, price and spice. Cuisine is crossed with ambience, occasion, price and spice so learned preferences can depend on context: for example, inexpensive Italian but premium Gujarati. These are learned weights, not rules that assume a particular cuisine should be cheap or spicy. Feature vectors remain capped at 64 entries.

Base features have separate budgets per group (12 cuisine, 12 tags, 6 ambience, 4 occasion, one price and one spice), with sorted, deduplicated inputs. A long metadata list cannot evict other feature groups. Supporting examples contribute cosine similarity over taste features rather than one full vote for any shared tag. Price and spice alone still provide no supporting evidence. A fitted inverted index maps taste features to supporting examples, avoiding full feedback scans during inference; its size is linear in the training features.

The model is rebuilt deterministically when feedback or catalogue features change. Undo restores the earlier model; accounts have separate cache keys. Already-rated restaurants receive their existing direct-feedback adjustment instead of a second ML adjustment. Unseen venues need overlapping taste evidence, and ML changes their score by at most six points. Dietary and travel eligibility remain enforced by the recommendation pipeline. Cold starts use the existing quiz-based ranking.

The final bounded score retains fractional precision as `rankScore` for ordering; the displayed `score` remains a rounded integer. Home, Saved, Discover and the companion retain this precision when sorting by taste. A small learned signal no longer disappears into a display tie. Numeric review quality is still weighted by review count, but free-text review keywords do not earn scoring bonuses or generate praise claims: “not quiet” is not evidence of peaceful ambience.

## Evaluation, 22 October 2026

`node work/check-ml-ranking.cjs` tests 24 synthetic preference patterns across cuisine with ambience, occasion, price and spice. Each pattern trains on 12 restaurant IDs and evaluates four unseen IDs (96 held-out cases in total). The previous learner scored 0.875 mean AUC and 0.875 precision at two; adding the contextual crosses scored 1.0 for both on these cases.

These examples deliberately reuse feature combinations with new IDs. They demonstrate that the model can represent the intended preferences, not real-world accuracy or generalisation to entirely new combinations. The suite also checks contradictory evidence, imbalanced feedback, finite bounded outputs and cache reuse. The separate taste-model suite covers cold start, aliases, undo, catalogue refresh and account reset.

Additional stress cases cover five splits with 20% contradictory labels and unseen tags (20 held-out predictions), feature lists exceeding the budget, input-order invariance, weak versus strong neighbours, and equivalence of indexed and reference evidence calculations. All five noisy splits preserve the intended relative ranking. These remain synthetic tests, not a production accuracy estimate. The inference test also verifies that an indexed model does not access its training sample list while scoring.

Majority-evidence regressions test identical features with 90 likes/one pass and the reverse, while retaining exact neutrality for a balanced identical pair. Distinct minority preferences must retain their sign despite class imbalance. `check-ranking-precision.cjs` exercises the actual learner through `rec()` and `ranked()`, including small learned differences, integer display, exact undo and legacy tie-breaks; catalogue eligibility and GPS are stubbed there and covered separately by integration checks.

Real-user improvement still requires an evaluation dataset of consented feedback and a user/time-separated holdout. Match percentages are preference estimates, not calibrated probabilities of satisfaction.
