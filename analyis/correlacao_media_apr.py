import pandas as pd

# carrega tabela notas x disciplinas
df = pd.read_csv('./files.csv/notas_x_disciplina.csv')

dados = []

for disciplina in df.columns:

    # remove NaN
    notas = df[disciplina].dropna()

    # ignora disciplinas com poucas notas
    if len(notas) > 50:

        # média da disciplina
        media = notas.mean()

        # taxa de reprovação
        # considerando reprovação < 7
        reprovados = (notas < 7).sum()

        taxa_reprovacao = reprovados / len(notas)

        dados.append({
            'disciplina': disciplina,
            'media': media,
            'taxa_reprovacao': taxa_reprovacao
        })

# cria dataframe
df_correlacao = pd.DataFrame(dados)

# calcula correlação
correlacao = df_correlacao['media'].corr(
    df_correlacao['taxa_reprovacao']
)

print("Correlação:", correlacao)

# salva csv
df_correlacao.to_csv(
    './files.csv/correlacao_media_reprovacao.csv',
    index=False
)

print(df_correlacao)