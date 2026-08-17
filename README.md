# Day 1: Explain Titanic Prediction Errors

This project compares a majority-class baseline with a Random Forest model on
historical Titanic passenger records for a museum education demonstration.

## Problem and boundary

- **User:** a museum education team explaining data and model limitations.
- **Input:** Kaggle Titanic `train.csv`, with 891 passenger rows and 12 columns.
- **Output:** comparable metrics on one held-out test set and real misclassified rows.
- **Important error:** a false negative, where a real survivor is predicted not to survive.
- **Boundary:** this is historical observational analysis, not a modern rescue tool and not causal evidence.

## Data

Download only [Titanic Dataset - train.csv](https://www.kaggle.com/datasets/hesh97/titanicdataset-traincsv).
Unzip it and place the file at `data/raw/train.csv`. The raw file is ignored by Git.

## Setup and run

Open this folder in VS Code, select the `.venv` interpreter when it exists, then run one command at a time in its PowerShell terminal:

```powershell
.\.venv\Scripts\python.exe train.py --check-data
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
.\.venv\Scripts\python.exe train.py
```

Create the environment and install dependencies once before those commands:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

The data check must report 891 rows and survived counts `{0: 549, 1: 342}`.
The final command creates `metrics.json` and `errors.csv`.

## Verified result

Using the required 891-row file on 2026-08-17, the baseline and candidate
were evaluated on the same 223 held-out passengers:

| Metric | Majority baseline | Random Forest candidate |
| --- | ---: | ---: |
| accuracy | 0.6143 | 0.7444 |
| recall_survived | 0.0000 | 0.6279 |
| f1_survived | 0.0000 | 0.6545 |
| confusion matrix, labels 0 then 1 | [[137, 0], [86, 0]] | [[112, 25], [32, 54]] |

The candidate reduced false negatives from 86 to 32. It is more useful on
this fixed split, but still misses 32 real survivors.

## Method

The program uses a fixed 75/25 stratified split with random seed 42. Numeric
features are filled with the training median; categorical features are filled
with the training mode and one-hot encoded. Both the baseline and candidate use
the same preprocessing, split and metrics.

The baseline is `DummyClassifier(strategy="most_frequent")`. The candidate is
`RandomForestClassifier(random_state=42)` in the same sklearn `Pipeline`.

## Evidence and limitations

Compare accuracy, survivor recall, survivor F1 and the confusion matrix in
`metrics.json`. Open `errors.csv` and discuss at least one real false negative.
Do not claim that a passenger feature caused survival or death. Results describe
only this dataset and this fixed split.
