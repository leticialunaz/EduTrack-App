import pandas as pd
import numpy as np

# importa seu modelo pronto
from wang_mendel import sistema  # ajuste para seu arquivo real


df = pd.read_csv('./files/respostas_notas.csv')


def label_r(x):
    if x < 4:
        return 'baixo'
    elif x < 7:
        return 'medio'
    elif x < 9:
        return 'alto'
    else:
        return 'muito_alto'

df['true_label'] = df['media_final'].apply(label_r)


def predict(q18, q19):
    sistema.input['q18'] = q18
    sistema.input['q19'] = q19
    sistema.compute()

    val = sistema.output['r']

    if val < 4:
        return 'baixo'
    elif val < 7:
        return 'medio'
    elif val < 9:
        return 'alto'
    else:
        return 'muito_alto'


preds = []

for _, row in df.iterrows():
    p = predict(row['q18'], row['q19'])
    preds.append(p)

df['predicted'] = preds


accuracy = (df['true_label'] == df['predicted']).mean()

print("\nACURÁCIA GERAL:", accuracy)

# =========================
print("\nDistribuição real:")
print(df['true_label'].value_counts())

print("\nDistribuição predita:")
print(df['predicted'].value_counts())


print("\nAcurácia por classe:")

for label in df['true_label'].unique():
    subset = df[df['true_label'] == label]
    acc = (subset['true_label'] == subset['predicted']).mean()
    print(f"{label}: {acc:.3f}")