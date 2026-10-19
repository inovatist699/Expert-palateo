# Personalized recommendation learning

The canonical shared learner in `src/features/recommendations/learner.js` trains from the signed-in account's explicit restaurant likes and passes. Both web and Android use this source and the existing account/feedback APIs. It trains locally from available feedback; no new data service or pooled-user training is introduced. Cloud-backed venue feedback follows the existing sync contract; device-only venues retain its existing device-local limitation.

With both liked and passed examples, regularized pairwise logistic training learns a higher score for preferred feature vectors. Deterministic rotating pairs keep training linear in feedback count (24 epochs), rather than enumerating every pair. This adapts the pairwise logistic objective described in [Bayesian Personalized Ranking](https://arxiv.org/abs/1205.2618) to explicit feedback and venue features; unobserved venues are not assumed negative. With only one feedback class, the previous pointwise logistic learner remains the fallback.

Features include cuisine, meaningful tags, atmosphere, occasion, price and spice, plus bounded cuisine/atmosphere combinations. This can learn different atmosphere preferences for different cuisines. Location, identity and dietary eligibility are not learned features. Candidate scores receive at most ±6 learned points; quiz preference matching, dish preferences and supported review evidence still contribute. Vegetarian/pure-veg eligibility and distance limits run before ranking and cannot be overridden by ML.

The model is cached by account and exact training examples, rebuilt after feedback or catalogue changes, and never stored as an irreversible update. Undo restores the corresponding model. Directly rated venues do not receive an additional inferred-feedback adjustment. The match score is an estimate, not a calibrated probability of satisfaction.

## Evaluation

`node work/check-ml-ranking.cjs` evaluates 24 held-out synthetic venues across six preference patterns: cuisine, atmosphere, and crossed cuisine/atmosphere choices. Candidate IDs are separate from training IDs. This is a capability regression with matching feature distributions, not real-world validation. At implementation, mean pairwise AUC and precision@2 improved from 0.8333 for the previous learner to 1.0 for the upgraded learner on these fixtures. No real-user uplift is claimed.

Tests also cover conflicting indistinguishable examples, one-class/cold starts, class imbalance, finite/bounded scores, deterministic feedback order, cache reuse, exact undo and account resets. Full recommendation, dietary, pure-veg and location checks remain release gates. Real-world effectiveness requires consented outcome data and a held-out evaluation or controlled experiment; visits alone are not treated as a satisfaction label.
