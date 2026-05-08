import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.decomposition import PCA, NMF


df_topico1 = pd.read_csv('./files/topico_carreira.csv')
df_topico2 = pd.read_csv('./files/topico_estudo.csv')
df_topico3 = pd.read_csv('./files/topico_institucional.csv')    
df_topico4 = pd.read_csv('./files/topico_interpessoal.csv')
df_topico5 = pd.read_csv('./files/topico_pessoal.csv')


#transformando em nparray para rodar no pca, tira a coluna nome ja que nao eh um valor que vai ser utilizado
matriz_topico1 = df_topico1.drop(columns=["name"]).values
matriz_topico2 = df_topico2.drop(columns=["name"]).values
matriz_topico3 = df_topico3.drop(columns=["name"]).values
matriz_topico4 = df_topico4.drop(columns=["name"]).values
matriz_topico5 = df_topico5.drop(columns=["name"]).values



#tira os alunos que tem em alguma coluna null ja que o pca nao aceita null
matriz_topico1 = matriz_topico1[~np.isnan(matriz_topico1).any(axis=1)]
matriz_topico2 = matriz_topico2[~np.isnan(matriz_topico2).any(axis=1)]
matriz_topico3 = matriz_topico3[~np.isnan(matriz_topico3).any(axis=1)]
matriz_topico4 = matriz_topico4[~np.isnan(matriz_topico4).any(axis=1)]
matriz_topico5 = matriz_topico5[~np.isnan(matriz_topico5).any(axis=1)]  



def rodar_pca(matriz):
    scaler = StandardScaler()
    X_std = scaler.fit_transform(matriz)

    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X_std)
    
    explained_variance_ratio = pca.explained_variance_ratio_
    #explained_variance = np.var(X_pca, axis=0)
    #explained_variance_ratio = explained_variance / np.sum(explained_variance)

    #X_reconstructed = pca.inverse_transform(pca.transform(X_std))
    #reconstruction_error = np.mean((X_std - X_reconstructed)**2)

    return np.cumsum(pca.explained_variance_ratio_), explained_variance_ratio


def rodar_nmf(matriz):
    scaler = MinMaxScaler()
    X_std = scaler.fit_transform(matriz)

    nmf = NMF(n_components=2, random_state=42)
    W = nmf.fit_transform(X_std)
    H = nmf.components_

    X_reconstructed = np.dot(W, H)
    reconstruction_error = np.mean((X_std - X_reconstructed)**2)    

    return W, H, reconstruction_error

#score1, var1 = rodar_pca(matriz_topico1)
#score2, var2 = rodar_pca(matriz_topico2)
#score3, var3 = rodar_pca(matriz_topico3)
#score4, var4 = rodar_pca(matriz_topico4)
#score5, var5 = rodar_pca(matriz_topico5)

score1, var1, comp1 = rodar_nmf(matriz_topico1)
score2, var2, comp2 = rodar_nmf(matriz_topico2)
score3, var3, comp3 = rodar_nmf(matriz_topico3)
score4, var4, comp4 = rodar_nmf(matriz_topico4)
score5, var5, comp5 = rodar_nmf(matriz_topico5)

print("Variância explicada:")
print("Topico 1:", var1)
print("Topico 2:", var2)
print("Topico 3:", var3)
print("Topico 4:", var4)
print("Topico 5:", var5)

