import numpy as np
from scipy.stats import spearmanr
from sklearn.model_selection import KFold
import pandas as pd
import pdb

def forward_selection_cv(df, itens, alvo, max_itens=15, n_splits=5, random_state=42):
    """
    Seleção forward stepwise com validação cruzada.
    Retorna a lista de itens selecionados e o rho médio por fold.
    """
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=random_state)
    selecionados = []
    disponiveis = list(itens)
    historico_rho = []

    for passo in range(max_itens):
        melhor_candidato = None
        melhor_rho_medio = 0#-np.inf

        for candidato in disponiveis:
            candidatos_teste = selecionados + [candidato]
            rhos_fold = []

            for treino_idx, teste_idx in kf.split(df):
                df_treino = df.iloc[treino_idx]
                df_teste  = df.iloc[teste_idx]

                score_teste = df_teste[candidatos_teste].mean(axis=1)
                mask = score_teste.notna() & df_teste[alvo].notna()

                if mask.sum() < 5:
                    continue

                serie_score = score_teste[mask]
                serie_alvo  = df_teste.loc[mask, alvo]

                # Checar se há variância nas duas séries antes de calcular
                if serie_score.nunique() < 2 or serie_alvo.nunique() < 2:
                    continue  # pula esse fold, não adiciona rho

                rho, _ = spearmanr(serie_score, serie_alvo)

                if not np.isnan(rho):  # garantia extra
                    rhos_fold.append(rho)

            if not rhos_fold:
                continue

            rho_medio = np.mean(rhos_fold)
            #print("rho_medio: ", rho_medio, ", melhor_rho_medio: ", melhor_rho_medio)

            if abs(rho_medio) > abs(melhor_rho_medio):
                melhor_rho_medio = rho_medio
                melhor_candidato = candidato
                

        if melhor_candidato is None:
            break

        selecionados.append(melhor_candidato)
        disponiveis.remove(melhor_candidato)
        historico_rho.append(melhor_rho_medio)
        print(f"Passo {passo+1}: +{melhor_candidato} | "
              f"Itens: {len(selecionados)} | Rho médio CV: {melhor_rho_medio:.4f}")

    return selecionados, historico_rho

# USO
df_topico = pd.read_csv('topico_interpessoal.csv')
df_notas = pd.read_csv('medias_cra.csv')

df = pd.merge(df_topico, df_notas, on="name")

itens = list(df.columns)
itens.remove('name')
itens.remove('media_final')
alvo = 'media_final'

selecionados, rhos = forward_selection_cv(df, itens, alvo, max_itens=2, n_splits=5)
print("selecionados: ", selecionados)
print("rhos: ", rhos)