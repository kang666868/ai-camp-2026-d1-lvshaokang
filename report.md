# Daily Assignment Report: Day 1

## 1. Problem

- **Student or team:** 吕绍康 U202412686
- **User:** museum education team explaining historical data and model limits.
- **Input:** Kaggle Titanic `train.csv`, 891 rows and 12 columns.
- **Output:** baseline and candidate metrics on one common held-out test set, plus real error rows.
- **Important error:** false negatives: real survivors predicted not to survive.
- **Boundary:** historical observational analysis only; it is not a modern rescue tool and cannot prove causation.

## 2. Data and verification

- **Source:** https://www.kaggle.com/datasets/hesh97/titanicdataset-traincsv
- **File location:** `data/raw/train.csv`
- **Check command:** `python train.py --check-data`
- **Observed check:** `REAL DATA CHECK PASSED`; 891 rows, 12 columns,
  survived counts `{0: 549, 1: 342}`, missing Age 177, Cabin 687 and Embarked 2.
- **Known missing data:** Age has 177 missing values, Embarked has 2, and Cabin has 687.

## 3. Reproducible commands

```powershell
python train.py --check-data
python -m pip install -r requirements.txt
python -m unittest discover -s tests -v
python train.py
```

The last command writes `metrics.json` and `errors.csv`. Before submission,
copy your actual command outputs to an `evidence/` folder if your teacher asks
for archived terminal evidence.

## 4. Fair comparison

The baseline is `DummyClassifier(strategy="most_frequent")`, which always
predicts the majority training class and uses no passenger information. The
candidate is a `Pipeline` with the same preprocessing followed by
`RandomForestClassifier(random_state=42)`.

Both use the same Kaggle file, seven features, 75/25 stratified split with seed
42, and the same evaluation function. Therefore the comparison is fair. The
test set contains 223 passengers.

| Metric | Baseline | Random Forest | Meaning |
| --- | ---: | ---: | --- |
| accuracy | 0.6143 | 0.7444 | Overall fraction correct |
| recall_survived | 0.0000 | 0.6279 | Fraction of real survivors found |
| f1_survived | 0.0000 | 0.6545 | Balance of survivor precision and recall |
| false negatives | 86 | 32 | Real survivors predicted not to survive |

The baseline confusion matrix is `[[137, 0], [86, 0]]`: it predicts every
passenger as not surviving. The candidate matrix is `[[112, 25], [32, 54]]`.
It correctly identifies 54 real survivors, but misses 32.

## 5. One real error

Choose one row from `errors.csv` where `true_survived` is 1 and
`predicted_survived` is 0.

- **PassengerId and source_row:** PassengerId 348; source_row 347.
- **Passenger:** Davison, Mrs. Thomas Henry (Mary E Finck).
- **Observed fields:** Pclass 3, Sex female, Age missing, SibSp 1, Parch 0,
  Fare 16.1, Embarked S.
- **Historical label and model prediction:** true_survived = 1;
  predicted_survived = 0.
- **What it shows:** the model can still miss individual survivors.
- **What it does not show:** no observed feature caused the historical outcome, and this one row does not explain the model's exact internal decision.
- **Next check:** compare Pclass, Sex and missing Age for all false negatives against true positives.

## 6. Conclusion and limits

On the same 223 held-out records, the Random Forest improved accuracy from
0.6143 to 0.7444, survivor recall from 0 to 0.6279, and survivor F1 from 0 to
0.6545. This makes it more useful than the majority baseline for identifying
survivors in this fixed experiment. The result applies only to this file and
fixed split. It cannot support causal claims or modern rescue decisions.

## 7. AI assistance and student verification

AI assistance helped scaffold and explain the implementation. I personally
downloaded the specified data, ran the data check, tests and main program, read
the metrics and error row, and verified that raw data and secrets are ignored
by Git.
