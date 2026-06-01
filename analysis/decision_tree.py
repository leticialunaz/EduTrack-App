import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
from sklearn.tree import export_text

df = pd.read_csv('./files/respostas_notas.csv')


def label_rendimento(x):
    if x < 4:
        return 'baixo'
    elif x < 7:
        return 'medio'
    else:    
         return 'alto'

df['classe'] = df['media_final'].apply(label_rendimento)

X = df.drop(columns=['name', 'media_final', 'classe'])

y = df['classe']

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

modelo = DecisionTreeClassifier(
    max_depth=4,
    random_state=42
)

modelo.fit(X_train, y_train)


pred = modelo.predict(X_test)

acc = accuracy_score(y_test, pred)

print("\nACURÁCIA:", acc)



regras = export_text(
    modelo,
    feature_names=list(X.columns)
)

print("\nREGRAS GERADAS:\n")
print(regras)