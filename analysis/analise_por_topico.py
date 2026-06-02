import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error
from sklearn.metrics import accuracy_score


df_notas = pd.read_csv('./files/medias_cra.csv')

df_carreira = pd.read_csv('./files/topico_carreira.csv')
df_estudo = pd.read_csv('./files/topico_estudo.csv')
df_institucional = pd.read_csv('./files/topico_institucional.csv')
df_interpessoal = pd.read_csv('./files/topico_interpessoal.csv')
df_pessoal = pd.read_csv('./files/topico_pessoal.csv')

df = pd.DataFrame()

df['name'] = df_carreira['name']

df['carreira_score'] = df_carreira.iloc[:, 1:].mean(axis=1)
df['estudo_score'] = df_estudo.iloc[:, 1:].mean(axis=1)
df['institucional_score'] = df_institucional.iloc[:, 1:].mean(axis=1)
df['interpessoal_score'] = df_interpessoal.iloc[:, 1:].mean(axis=1)
df['pessoal_score'] = df_pessoal.iloc[:, 1:].mean(axis=1)

df = pd.merge(df, df_notas, on='name')

#print(df.head(4))

#label para as notas
def label(x):

    if x < 5:
        return 'baixo'

    elif x <= 8:
        return 'medio'

    else:
        return 'alto'

#inicio do aprendizado de maquina: primeira tentativa, com linear regression
X = df[
    [
        'carreira_score',
        'estudo_score',
        'institucional_score',
        'interpessoal_score',
        'pessoal_score'
    ]
]

y = df['media_final']

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.3,
    random_state=42
)

model = LinearRegression().fit(X_train, y_train)

#analises para ver se o modelo foi bem utilizado
pred = model.predict(X_test)

real = y_test.apply(label)

pred_class = [label(x) for x in pred]


acc = accuracy_score(real, pred_class)

print("ACURÁCIA:", acc)

print("R²:", r2_score(y_test, pred))
print("MAE:", mean_absolute_error(y_test, pred))

print("\nCoeficientes:")
for nome, coef in zip(X.columns, model.coef_):
    print(nome, "=", coef)


print(
    df.corr(numeric_only=True)['media_final']
)