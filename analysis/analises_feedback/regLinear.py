import pandas as pd
from scipy.stats import spearmanr
import statsmodels.formula.api as smf
import pdb
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score
from sklearn.metrics import r2_score
import numpy as np

nSamples = 100
df_topico = pd.read_csv('topico_interpessoal.csv') #.sample(nSamples)
df_notas = pd.read_csv('medias_cra.csv')

df_topico1 = pd.merge(df_topico, df_notas, on="name")
#perguntas_relevantes_carreira = ['q18', 'q19']

y = df_topico1['media_final']
df_topico1 = df_topico1.drop(columns=["media_final", "name"])
'''
df_topico1 = pd.read_csv('topico_carreira_notas.csv').sample(nSamples)
	df_topico2 = pd.read_csv('topico_estudo_notas.csv').sample(nSamples)
	df_topico3 = pd.read_csv('topico_institucional_notas.csv').sample(nSamples)    
	df_topico4 = pd.read_csv('topico_interpessoal_notas.csv').sample(nSamples)
	df_topico5 = pd.read_csv('topico_pessoal_notas.csv').sample(nSamples)
'''
df = pd.DataFrame()

itens_sel =  ['q121', 'q119']
df['indice_global'] = df_topico1[itens_sel].mean(axis=1)

rho, p = spearmanr(df['indice_global'], y)
print("Spearman rho = ", rho, "p-valor = ", p)

rho, p = spearmanr(df_topico1['q113'], df_topico1['q114'])
print("entre os atributos: Spearman rho = ", rho, "p-valor = ", p)

df['media_final'] = y

modelo = smf.ols("indice_global ~ media_final", data=df).fit()
print(modelo.summary())

print("REGRESSÃO MÚLTIPLA!!!")

X = df_topico1[itens_sel].values
y = df['media_final'].values

modelo_sk = LinearRegression()
modelo_sk.fit(X, y)

# R² no treino completo
y_pred = modelo_sk.predict(X)
print("R² treino:", r2_score(y, y_pred))

# R² em validação cruzada (muito importante!)
scores_r2 = cross_val_score(modelo_sk, X, y, cv=5, scoring='r2')
print("R² CV médio:", scores_r2.mean(), "+/-", scores_r2.std())

#pdb.set_trace()
