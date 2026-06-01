import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn import tree
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

nSamples = 100

df_notas = pd.read_csv('./files/medias_cra.csv')

#df_carreira = pd.read_csv('./files/topico_carreira.csv')
#df_estudo = pd.read_csv('./files/topico_estudo.csv')
#df_institucional = pd.read_csv('./files/topico_institucional.csv')
df_interpessoal = pd.read_csv('./files/topico_interpessoal.csv')



#df_topico1 = pd.merge(df_carreira, df_notas, on='name')
#df_topico2 = pd.merge(df_estudo, df_notas, on='name')
#df_topico3 = pd.merge(df_institucional, df_notas, on='name')    
df_topico4 = pd.merge(df_interpessoal, df_notas, on='name')
# df_topico5 = pd.read_csv('topico_pessoal_notas.csv').sample(nSamples)

#pdb.set_trace()

df_topico4 = df_topico4.dropna()

df_X = df_topico4.drop(columns=['name', 'media_final'])
edges = [0, 6, 8, 10]
labels = ['baixo', 'medio', 'alto']

df_y = pd.DataFrame()
df_y['desempenho'] = pd.cut(df_topico4['media_final'], bins=edges, labels=labels)

mask = df_y['desempenho'].notna()
df_X = df_X[mask]
df_y = df_y[mask]

X_train, X_test, y_train, y_test = train_test_split(
    df_X,
    df_y['desempenho'],
    test_size=0.3,
    random_state=42
)

#print(df_y.isna().sum().sum())

clf = tree.DecisionTreeClassifier()
clf = clf.fit(X_train, y_train)

pred = clf.predict(X_test)

print(df_X.columns[2])
acc = accuracy_score(y_test, pred)

print("ACURÁCIA:", acc)


fig = plt.figure(figsize=(24, 16))
tree.plot_tree(clf, class_names=labels, filled=True)
plt.savefig("arvore_interpessoal.png")
'''
df_topico1 = discretizaTopicos(df_topico1)
df_topico2 = discretizaTopicos(df_topico2)
df_topico3 = discretizaTopicos(df_topico3)
df_topico4 = discretizaTopicos(df_topico4)
df_topico5 = discretizaTopicos(df_topico5)
'''
