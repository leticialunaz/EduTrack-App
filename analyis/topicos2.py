import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, RobustScaler
from sklearn.decomposition import PCA, KernelPCA, TruncatedSVD, NMF
from sklearn.metrics import explained_variance_score
from sklearn.metrics import mean_squared_error
from pgmpy.estimators import PC, HillClimbSearch, BDeu
from pgmpy.models import BayesianNetwork
from pgmpy.estimators import BayesianEstimator
import pdb
import networkx as nx
import matplotlib.pyplot as plt

df_topico1 = pd.read_csv('topico_carreira_notas.csv')
df_topico2 = pd.read_csv('topico_estudo_notas.csv')
df_topico3 = pd.read_csv('topico_institucional_notas.csv')    
df_topico4 = pd.read_csv('topico_interpessoal_notas.csv')
df_topico5 = pd.read_csv('topico_pessoal_notas.csv')


#transformando em nparray para rodar no pca, tira a coluna nome ja que nao eh um valor que vai ser utilizado
matriz_topico1 = df_topico1.drop(columns=["name", "media_notas"]).values
matriz_topico2 = df_topico2.drop(columns=["name", "media_notas"]).values
matriz_topico3 = df_topico3.drop(columns=["name", "media_notas"]).values
matriz_topico4 = df_topico4.drop(columns=["name", "media_notas"]).values
matriz_topico5 = df_topico5.drop(columns=["name", "media_notas"]).values

#tira os alunos que tem em alguma coluna null ja que o pca nao aceita null
matriz_topico1 = matriz_topico1[~np.isnan(matriz_topico1).any(axis=1)]
matriz_topico2 = matriz_topico2[~np.isnan(matriz_topico2).any(axis=1)]
matriz_topico3 = matriz_topico3[~np.isnan(matriz_topico3).any(axis=1)]
matriz_topico4 = matriz_topico4[~np.isnan(matriz_topico4).any(axis=1)]
matriz_topico5 = matriz_topico5[~np.isnan(matriz_topico5).any(axis=1)]  


def rodar_pca(matriz):

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(matriz)

    pca = PCA(n_components=1, svd_solver='full')
    
    X_kpca = pca.fit_transform(X_scaled)
    
    print(pca.explained_variance_ratio_)
    #print(pca.singular_values_)
    
    #matriz_corr = np.corrcoef(matriz)
    #print(matriz_corr[0,:])
    
    #pdb.set_trace()
    
    return pca.explained_variance_ratio_ , X_kpca


'''
0,00 a 0,10: Nula ou irrisória.
0,11 a 0,39: Fraca.
0,40 a 0,69: Moderada.
0,70 a 0,89: Forte.
0,90 a 1,00: Muito Forte/Perfeita
'''

thrs1 = 0.5
thrs2 = 0.7
thrs3 = 0.38
thrs4 = 0.31
thrs5 = 0.54

lIndex1 = []
lIndex2 = []
lIndex3 = []
lIndex4 = []
lIndex5 = []
lLabels = ['media_notas']


print("Tópico Carreira - 1")

somaNoIndice = 0

mNotas = df_topico1['media_notas'].values

for x in range(0, matriz_topico1.shape[1]):
	corr = np.corrcoef(matriz_topico1[:,x], mNotas)[0,1]
	if np.abs(corr) > thrs1:
		lIndex1.append(x)
		lLabels.append('q'+str(somaNoIndice+x+1)+'t1')
		print("pergunta: ", somaNoIndice+x+1, ", ", corr)

print("Tópico Estudo - 2")

somaNoIndice = 35

mNotas = df_topico2['media_notas'].values

for x in range(0, matriz_topico2.shape[1]):
	corr = np.corrcoef(matriz_topico2[:,x], mNotas)[0,1]
	if np.abs(corr) > thrs2:
		lIndex2.append(x)
		lLabels.append('q'+str(somaNoIndice+x+1)+'t2')
		print("pergunta: ", somaNoIndice+x+1, ", ", corr)

print("Tópico Instuticional - 3")

somaNoIndice = 35+34

mNotas = df_topico3['media_notas'].values

for x in range(0, matriz_topico3.shape[1]):
	corr = np.corrcoef(matriz_topico3[:,x], mNotas)[0,1]
	if np.abs(corr) > thrs3:
		lIndex3.append(x)
		lLabels.append('q'+str(somaNoIndice+x+1)+'t3')
		print("pergunta: ", somaNoIndice+x+1, ", ", corr)

print("Tópico Interpessoal - 4")

somaNoIndice = 35+34+45

mNotas = df_topico4['media_notas'].values


for x in range(0, matriz_topico4.shape[1]):
	corr = np.corrcoef(matriz_topico4[:,x], mNotas)[0,1]
	if np.abs(corr) > thrs4:
		lIndex4.append(x)
		lLabels.append('q'+str(somaNoIndice+x+1)+'t4')
		print("pergunta: ", somaNoIndice+x+1, ", ", corr)


print("Tópico Pessoal - 5")

somaNoIndice = 35+34+45+23

mNotas = df_topico5['media_notas'].values

for x in range(0, matriz_topico5.shape[1]):
	corr = np.corrcoef(matriz_topico5[:,x], mNotas)[0,1]
	if np.abs(corr) > thrs5:
		lIndex5.append(x)
		lLabels.append('q'+str(somaNoIndice+x+1)+'t5')
		print("pergunta: ", somaNoIndice+x+1, ", ", corr)

reducedData = np.zeros((matriz_topico5.shape[0], len(lIndex1)+len(lIndex2)+len(lIndex3)+len(lIndex4)+len(lIndex5)+1))

reducedData[:,0] = df_topico1['media_notas'].values

reducedData[:,1:1+len(lIndex1)] = df_topico1.values[:,lIndex1]
reducedData[:,1+len(lIndex1):1+len(lIndex1)+len(lIndex2)] = df_topico2.values[:,lIndex2]
reducedData[:,1+len(lIndex1)+len(lIndex2):1+len(lIndex1)+len(lIndex2)+len(lIndex3)] = df_topico3.values[:,lIndex3]
reducedData[:,1+len(lIndex1)+len(lIndex2)+len(lIndex3):1+len(lIndex1)+len(lIndex2)+len(lIndex3)+len(lIndex4)] = df_topico4.values[:,lIndex4]
reducedData[:,1+len(lIndex1)+len(lIndex2)+len(lIndex3)+len(lIndex4):1+len(lIndex1)+len(lIndex2)+len(lIndex3)+len(lIndex4)+len(lIndex5)] = df_topico5.values[:,lIndex5]

column_names = lLabels

df_aux = pd.DataFrame(data=reducedData, columns=column_names)

df_aux['media_notas'] = pd.qcut(df_aux['media_notas'], q=5)

#df = pd.DataFrame(series_dict)

est = PC(df_aux)

#model_est = est.estimate(variant='stable', ci_test='chi_square', significance_level=0.1).to_dag()
'''
model_est = est.estimate(
    variant="stable",
    ci_test="chi_square",
    significance_level=0.01,   # conservador para amostras pequenas
    max_cond_vars=3,            # reduzido! padrão é 5
    return_type="pdag",         # retorna grafo parcialmente orientado
    show_progress=True
)
'''

scoring = BDeu(
    df_aux,
    equivalent_sample_size=5  # conservador para n=150
)
hc = HillClimbSearch(df_aux)
model_est = hc.estimate(
    scoring_method=scoring,
    max_indegree=3,       # limita nº de pais por nó (regularização estrutural)
    max_iter=1_000,       # iterações máximas
    epsilon=1e-4,         # tolerância mínima de melhora para continuar
    show_progress=True
)

#print(len(model_gsq.edges()))
nx.draw_circular(model_est, with_labels=True, node_size=2000, node_color="skyblue", font_size=10, arrowsize=20)
plt.show()

'''
#model_est = est.estimate(ci_test="chi_square")
#print(len(model_est.edges()))


# Plot the graph
try:
    model_est.to_graphviz().draw('pc_causal_graph.png', prog='dot')
    print("Graph saved as pc_causal_graph.png")
except ImportError:
    print("pygraphviz not found, using networkx for plotting (might look different)")
    plt.figure(figsize=(10, 8))
    nx.draw_networkx(model_est, with_labels=True, arrowsize=20, node_size=1000, node_color='lightblue')
    plt.axis('off')
    plt.show()
'''
