import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.metrics import mean_absolute_error
from sklearn.metrics import r2_score

df = pd.read_csv('./files/respostas_notas.csv')

X = df[['q18', 'q19', 'q51', 'q54', 'q90', 'q92', 'q114', 'q113', 'q140', 'q145']]
y = df['media_final']


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.3,
    random_state=42
)

model = LinearRegression().fit(X_train, y_train)

pred = model.predict(X_test)

def label(x):
    if x < 4:
        return 'baixo'
    elif x < 7:
        return 'medio'
    elif x < 9:
        return 'alto'
    else:
        return 'muito_alto'

real = y_test.apply(label)


pred_class = [label(x) for x in pred]


acc = accuracy_score(real, pred_class)

print("ACURÁCIA:", acc)


print("\nIntercepto:", model.intercept_)
print("Coeficientes:", model.coef_)


mae = mean_absolute_error(y_test, pred)




print("R2:", r2_score(y_test, pred))

print("MAE:", mae)