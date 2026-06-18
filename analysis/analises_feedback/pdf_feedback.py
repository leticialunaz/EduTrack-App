from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
    HRFlowable,
    KeepTogether,
)
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib import colors

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm

# ---------------------------------------------------------------------------
# Paleta de cores e constantes visuais
# ---------------------------------------------------------------------------

COR_PRIMARIA = colors.HexColor("#2F3E9E")       # azul-roxo principal (cabeçalho/títulos)
COR_PRIMARIA_CLARA = colors.HexColor("#EEF0FB")  # fundo claro para destaques
COR_SECUNDARIA = colors.HexColor("#21A179")      # verde (positivo/ganho)
COR_ALERTA = colors.HexColor("#E0703B")          # laranja (atenção)
COR_TEXTO = colors.HexColor("#2B2B33")
COR_TEXTO_SUAVE = colors.HexColor("#6B6B76")
COR_LINHA = colors.HexColor("#DCDCE6")
COR_BARRA_FUNDO = colors.HexColor("#E7E7F0")

# Versões em hexadecimal "puro" (sem # do reportlab) para usar no matplotlib
MPL_PRIMARIA = "#2F3E9E"
MPL_SECUNDARIA = "#21A179"
MPL_ALERTA = "#E0703B"
MPL_GRID = "#E2E2EC"
MPL_TEXTO = "#2B2B33"


def _cor_por_nota(nota):
    """Retorna uma cor de destaque (reportlab) de acordo com a faixa da nota."""
    if nota >= 4:
        return COR_SECUNDARIA
    elif nota >= 3:
        return COR_PRIMARIA
    return COR_ALERTA


def _cor_mpl_por_valor(valor):
    """Cor da barra do gráfico de acordo com o nível atual do comportamento,
    numa escala simples onde 'maior é melhor' (uso genérico/visão geral)."""
    if valor >= 4:
        return MPL_SECUNDARIA
    elif valor >= 2.5:
        return MPL_PRIMARIA
    return MPL_ALERTA


def _cor_mpl_por_adequacao(valor_atual, beta):
    """
    Cor de acordo com o quão perto o aluno está do valor recomendado para
    aquele atributo específico, considerando a direção do coeficiente (beta):
    - beta > 0: quanto mais próximo de 5, melhor.
    - beta < 0: quanto mais próximo de 1, melhor.
    - beta == 0: comportamento neutro, usa cor primária.
    """
    adequacao = _percentual_adequacao(valor_atual, beta)
    if adequacao is None:
        return MPL_PRIMARIA

    if adequacao >= 0.75:
        return MPL_SECUNDARIA
    elif adequacao >= 0.4:
        return MPL_PRIMARIA
    return MPL_ALERTA


def _percentual_adequacao(valor_atual, beta):
    """
    Retorna um valor de 0 a 1 representando o quão perto o aluno está do
    nível recomendado para aquele atributo, dada a direção do coeficiente.
    Retorna None se beta for None ou zero (comportamento neutro).
    """
    if beta is None or beta == 0:
        return None
    if beta > 0:
        return (valor_atual - 1) / 4  # 1 -> 0%% ... 5 -> 100%
    return (5 - valor_atual) / 4      # 5 -> 0% ... 1 -> 100%


# ---------------------------------------------------------------------------
# Gráfico
# ---------------------------------------------------------------------------

def gerar_grafico(resultado, caminho_saida="grafico_feedback.png"):
    nomes = []
    valores = []
    cores_barras = []

    for atributo in resultado["atributos"]:
        nome = atributo["nome"]
        nomes.append(nome[:28] + "…" if len(nome) > 28 else nome)
        valores.append(atributo["valor_atual"])

        beta = atributo.get("coeficiente")
        if beta is not None:
            cores_barras.append(_cor_mpl_por_adequacao(atributo["valor_atual"], beta))
        else:
            cores_barras.append(_cor_mpl_por_valor(atributo["valor_atual"]))

    plt.rcParams["font.family"] = "DejaVu Sans"
    fig, ax = plt.subplots(figsize=(7.2, 3.6), dpi=200)

    x = range(len(nomes))
    barras = ax.bar(
        x,
        valores,
        color=cores_barras,
        width=0.5,
        zorder=3,
        edgecolor="white",
        linewidth=0.6,
    )

    # Linhas de grade horizontais sutis, atrás das barras
    ax.set_axisbelow(True)
    ax.yaxis.grid(True, color=MPL_GRID, linewidth=0.8, zorder=0)

    # Remove bordas do gráfico (estilo "clean")
    for spine in ["top", "right", "left"]:
        ax.spines[spine].set_visible(False)
    ax.spines["bottom"].set_color(MPL_GRID)

    ax.set_ylim(0, 5.6)
    ax.set_yticks([0, 1, 2, 3, 4, 5])
    ax.tick_params(axis="y", colors=MPL_TEXTO, labelsize=9, length=0)
    ax.tick_params(axis="x", colors=MPL_TEXTO, labelsize=9, length=0)

    ax.set_xticks(list(x))
    ax.set_xticklabels(nomes, wrap=True)

    # Rótulo com o valor em cima de cada barra
    for rect, valor in zip(barras, valores):
        ax.text(
            rect.get_x() + rect.get_width() / 2,
            rect.get_height() + 0.15,
            f"{valor:.0f}/5",
            ha="center",
            va="bottom",
            fontsize=10,
            fontweight="bold",
            color=MPL_TEXTO,
        )

    ax.set_ylabel("Nível (escala 1–5)", fontsize=9, color=MPL_TEXTO_SUAVE if False else "#6B6B76")
    fig.tight_layout(pad=1.2)

    fig.savefig(caminho_saida, transparent=True)
    plt.close(fig)
    return caminho_saida


# ---------------------------------------------------------------------------
# Elementos visuais auxiliares (cards, barras de progresso)
# ---------------------------------------------------------------------------

def _barra_progresso_html(valor_atual, maximo=5, largura_total=54, cor_hex="#2F3E9E"):
    """
    Constrói uma 'barra de progresso' usando uma tabela de 1 linha com duas
    células coloridas (preenchido / vazio), retornada como Table do reportlab.
    """
    preenchido = max(0, min(valor_atual, maximo))
    largura_preenchida = (preenchido / maximo) * largura_total
    largura_vazia = largura_total - largura_preenchida

    data = [[""]] if largura_vazia <= 0 else [["", ""]]

    if largura_vazia <= 0:
        tabela = Table([[""]], colWidths=[largura_total], rowHeights=[8])
        tabela.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, 0), colors.HexColor(cor_hex)),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
            ('ROUNDEDCORNERS', [4, 4, 4, 4]),
        ]))
        return tabela

    tabela = Table([["", ""]], colWidths=[largura_preenchida, largura_vazia], rowHeights=[8])
    tabela.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), colors.HexColor(cor_hex)),
        ('BACKGROUND', (1, 0), (1, 0), COR_BARRA_FUNDO),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        ('ROUNDEDCORNERS', [4, 4, 4, 4]),
    ]))
    return tabela


def _cabecalho(nome_aluno, styles):
    elementos = []

    faixa = Table([[""]], colWidths=[17 * cm], rowHeights=[6])
    faixa.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), COR_PRIMARIA),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    elementos.append(faixa)
    elementos.append(Spacer(1, 14))

    elementos.append(Paragraph("RELATÓRIO DE DESENVOLVIMENTO ACADÊMICO", styles["TituloPrincipal"]))
    elementos.append(Paragraph(nome_aluno, styles["SubtituloAluno"]))
    elementos.append(Spacer(1, 10))

    return elementos


def _cards_resumo(nota, ganho_total, classificacao, cor_classificacao):
    cor_hex = "#%02x%02x%02x" % (
        int(cor_classificacao.red * 255),
        int(cor_classificacao.green * 255),
        int(cor_classificacao.blue * 255),
    )

    def _card(rotulo, valor_principal, cor_valor=COR_TEXTO):
        return Table(
            [[Paragraph(
                f"<font size=8 color='#6B6B76'>{rotulo}</font>"
                f"<br/><br/><font size=20 color='{cor_valor.hexval()[2:] if hasattr(cor_valor, 'hexval') else cor_valor}'><b>{valor_principal}</b></font>",
                getSampleStyleSheet()["Normal"],
            )]],
            colWidths=[5.5 * cm],
            rowHeights=[2.6 * cm],
        )

    estilo_card_base = [
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('LINEBELOW', (0, 0), (-1, -1), 3, COR_PRIMARIA),
        ('BACKGROUND', (0, 0), (-1, -1), colors.white),
        ('BOX', (0, 0), (-1, -1), 0.75, COR_LINHA),
        ('ROUNDEDCORNERS', [6, 6, 6, 6]),
    ]

    estilo_normal = ParagraphStyle(
        "CardLabel", fontName="Helvetica", fontSize=8.5, textColor=COR_TEXTO_SUAVE,
        alignment=TA_CENTER, leading=11,
    )
    estilo_valor = ParagraphStyle(
        "CardValor", fontName="Helvetica-Bold", fontSize=22, alignment=TA_CENTER, leading=26,
    )

    def _card_v2(rotulo, valor, cor_valor_hex, linha_destaque):
        p_label = Paragraph(rotulo, estilo_normal)
        estilo_v = ParagraphStyle(
            "v", parent=estilo_valor, textColor=colors.HexColor(cor_valor_hex),
        )
        p_valor = Paragraph(valor, estilo_v)
        t = Table([[p_label], [Spacer(1, 4)], [p_valor]], colWidths=[5.4 * cm])
        t.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('TOPPADDING', (0, 0), (0, 0), 12),
            ('BOTTOMPADDING', (-1, -1), (-1, -1), 12),
            ('TOPPADDING', (-1, -1), (-1, -1), 0),
            ('BOTTOMPADDING', (0, 0), (0, 0), 0),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
            ('LINEBELOW', (0, 0), (-1, -1), 3, colors.HexColor(linha_destaque)),
            ('BOX', (0, 0), (-1, -1), 0.75, COR_LINHA),
            ('BACKGROUND', (0, 0), (-1, -1), colors.white),
            ('ROUNDEDCORNERS', [6, 6, 6, 6]),
        ]))
        return t

    card_nota = _card_v2("NOTA ESTIMADA", f"{nota:.1f}", "#2F3E9E", "#2F3E9E")
    card_potencial = _card_v2("POTENCIAL DE GANHO", f"+{ganho_total:.1f}", "#21A179", "#21A179")
    card_classificacao = _card_v2("CLASSIFICAÇÃO", classificacao, cor_hex, cor_hex)

    linha = Table(
        [[card_nota, card_potencial, card_classificacao]],
        colWidths=[5.6 * cm, 5.6 * cm, 5.6 * cm],
    )
    linha.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ]))
    return linha


def _bloco_atributo(atributo, styles, cor_destaque):
    """Monta o bloco visual de um atributo: nome, barra de progresso e recomendação."""
    nome = atributo["nome"]
    valor_atual = atributo["valor_atual"]
    ganho = atributo["ganho_potencial"]
    recomendacao = atributo["recomendacao"]
    beta = atributo.get("coeficiente")

    cor_hex = "#%02x%02x%02x" % (int(cor_destaque.red * 255), int(cor_destaque.green * 255), int(cor_destaque.blue * 255))

    titulo = Paragraph(f"<b>{nome}</b>", styles["NomeAtributo"])
    nivel_txt = Paragraph(f"<font color='{cor_hex}'><b>{valor_atual}/5</b></font>", styles["NivelAtributo"])

    cabecalho_linha = Table(
        [[titulo, nivel_txt]],
        colWidths=[12.2 * cm, 2.4 * cm],
    )
    cabecalho_linha.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))

    # A barra de progresso mostra o nível real na escala 1-5 (sempre intuitiva:
    # cresce com o número). A cor (calculada à parte, via _cor_mpl_por_adequacao)
    # é quem comunica se esse nível é bom ou ruim para este atributo específico,
    # já que para alguns comportamentos "menor é melhor".
    barra = _barra_progresso_html(valor_atual, maximo=5, largura_total=14.6 * cm, cor_hex=cor_hex)

    if ganho > 0:
        selo = Paragraph(
            f"<font color='#21A179'><b>+{ganho:.2f} pts de ganho potencial</b></font>",
            styles["SeloGanho"],
        )
    else:
        selo = Paragraph("<font color='#6B6B76'><b>Sem ganho adicional estimado</b></font>", styles["SeloGanho"])

    recomendacao_p = Paragraph(f"<b>Recomendação:</b> {recomendacao}", styles["TextoRecomendacao"])

    conteudo = [
        [cabecalho_linha],
        [Spacer(1, 5)],
        [barra],
    ]
    conteudo.extend([
        [Spacer(1, 6)],
        [selo],
        [Spacer(1, 3)],
        [recomendacao_p],
    ])

    bloco = Table(conteudo, colWidths=[14.6 * cm])
    bloco.setStyle(TableStyle([
        ('LEFTPADDING', (0, 0), (-1, -1), 14),
        ('RIGHTPADDING', (0, 0), (-1, -1), 14),
        ('TOPPADDING', (0, 0), (0, 0), 10),
        ('BOTTOMPADDING', (-1, -1), (-1, -1), 10),
        ('TOPPADDING', (1, 0), (-2, -1), 0),
        ('BOTTOMPADDING', (1, 0), (-2, -1), 0),
        ('BOX', (0, 0), (-1, -1), 0.75, COR_LINHA),
        ('BACKGROUND', (0, 0), (-1, -1), colors.white),
        ('ROUNDEDCORNERS', [8, 8, 8, 8]),
    ]))
    return bloco


# ---------------------------------------------------------------------------
# Função principal
# ---------------------------------------------------------------------------

def gerar_pdf_feedback(nome_aluno, resultado):

    caminho_grafico = gerar_grafico(resultado)

    nome_arquivo = nome_aluno.replace(" ", "_")
    nome_pdf = f"feedback_{nome_arquivo}.pdf"

    doc = SimpleDocTemplate(
        nome_pdf,
        pagesize=A4,
        topMargin=0,
        bottomMargin=1.5 * cm,
        leftMargin=1.7 * cm,
        rightMargin=1.7 * cm,
    )

    base_styles = getSampleStyleSheet()

    styles = {
        "TituloPrincipal": ParagraphStyle(
            "TituloPrincipal", parent=base_styles["Title"],
            fontName="Helvetica-Bold", fontSize=19, leading=23,
            textColor=COR_TEXTO, alignment=TA_LEFT, spaceAfter=2,
        ),
        "SubtituloAluno": ParagraphStyle(
            "SubtituloAluno", parent=base_styles["Normal"],
            fontName="Helvetica", fontSize=12.5, leading=16,
            textColor=COR_TEXTO_SUAVE, alignment=TA_LEFT,
        ),
        "SecaoTitulo": ParagraphStyle(
            "SecaoTitulo", parent=base_styles["Heading2"],
            fontName="Helvetica-Bold", fontSize=13.5, leading=17,
            textColor=COR_PRIMARIA, spaceBefore=4, spaceAfter=2,
        ),
        "NomeAtributo": ParagraphStyle(
            "NomeAtributo", parent=base_styles["Normal"],
            fontName="Helvetica-Bold", fontSize=11, leading=14.5, textColor=COR_TEXTO,
        ),
        "NivelAtributo": ParagraphStyle(
            "NivelAtributo", parent=base_styles["Normal"],
            fontName="Helvetica-Bold", fontSize=11, leading=14.5, textColor=COR_TEXTO_SUAVE,
            alignment=TA_CENTER,
        ),
        "SeloGanho": ParagraphStyle(
            "SeloGanho", parent=base_styles["Normal"],
            fontName="Helvetica-Bold", fontSize=9.5, leading=12,
        ),
        "TextoRecomendacao": ParagraphStyle(
            "TextoRecomendacao", parent=base_styles["Normal"],
            fontName="Helvetica", fontSize=9.5, leading=13.5, textColor=COR_TEXTO,
        ),
        "Conclusao": ParagraphStyle(
            "Conclusao", parent=base_styles["Normal"],
            fontName="Helvetica", fontSize=10.5, leading=15.5, textColor=COR_TEXTO,
        ),
        "Rodape": ParagraphStyle(
            "Rodape", parent=base_styles["Normal"],
            fontName="Helvetica-Oblique", fontSize=8, leading=11, textColor=COR_TEXTO_SUAVE,
        ),
    }

    elementos = []

    # Cabeçalho com faixa colorida + título
    elementos.extend(_cabecalho(nome_aluno, styles))

    # Cards de resumo
    nota = resultado["nota_estimada"]
    if nota >= 4:
        classificacao = "Excelente"
    elif nota >= 3:
        classificacao = "Boa"
    else:
        classificacao = "Necessita Atenção"

    cor_classificacao = _cor_por_nota(nota)

    elementos.append(_cards_resumo(nota, resultado["ganho_total_possivel"], classificacao, cor_classificacao))
    elementos.append(Spacer(1, 18))

    # Gráfico
    elementos.append(Paragraph("Visão Geral dos Comportamentos", styles["SecaoTitulo"]))
    elementos.append(HRFlowable(width="100%", thickness=0.75, color=COR_LINHA, spaceBefore=4, spaceAfter=12))

    grafico = Image(caminho_grafico, width=15 * cm, height=5 * cm)
    elementos.append(grafico)
    elementos.append(Spacer(1, 6))

    # Detalhamento por atributo
    elementos.append(Paragraph("Detalhamento por Comportamento", styles["SecaoTitulo"]))
    elementos.append(HRFlowable(width="100%", thickness=0.75, color=COR_LINHA, spaceBefore=4, spaceAfter=12))

    atributos = sorted(
        resultado["atributos"],
        key=lambda x: x["ganho_potencial"],
        reverse=True,
    )

    for atributo in atributos:
        beta = atributo.get("coeficiente")
        if beta is not None:
            cor_destaque = _cor_mpl_por_adequacao(atributo["valor_atual"], beta)
        else:
            cor_destaque = _cor_mpl_por_valor(atributo["valor_atual"])
        cor_destaque_rl = colors.HexColor(cor_destaque)
        bloco = _bloco_atributo(atributo, styles, cor_destaque_rl)
        elementos.append(KeepTogether([bloco, Spacer(1, 10)]))

    elementos.append(Spacer(1, 2))

    # Conclusão
    if resultado["ganho_total_possivel"] > 0:
        conclusao = (
            "O modelo identificou oportunidades de melhoria em alguns comportamentos "
            "avaliados. Recomenda-se focar inicialmente nos atributos com maior ganho "
            "potencial, avançando de forma gradual."
        )
    else:
        conclusao = (
            "Os comportamentos avaliados já se encontram em níveis adequados. O modelo "
            "não identificou oportunidades relevantes de melhoria neste momento."
        )

    caixa_conclusao = Table(
        [[Paragraph(conclusao, styles["Conclusao"])]],
        colWidths=[17 * cm],
    )
    caixa_conclusao.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), COR_PRIMARIA_CLARA),
        ('BOX', (0, 0), (-1, -1), 0, colors.white),
        ('LEFTPADDING', (0, 0), (-1, -1), 14),
        ('RIGHTPADDING', (0, 0), (-1, -1), 14),
        ('TOPPADDING', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('ROUNDEDCORNERS', [8, 8, 8, 8]),
    ]))

    bloco_conclusao = [
        Paragraph("Conclusão", styles["SecaoTitulo"]),
        HRFlowable(width="100%", thickness=0.75, color=COR_LINHA, spaceBefore=4, spaceAfter=10),
        caixa_conclusao,
    ]
    elementos.append(KeepTogether(bloco_conclusao))
    elementos.append(Spacer(1, 16))
    elementos.append(HRFlowable(width="100%", thickness=0.5, color=COR_LINHA, spaceBefore=0, spaceAfter=6))
    elementos.append(Paragraph(
        "Este relatório foi gerado automaticamente a partir de um modelo estatístico e "
        "tem caráter orientativo.",
        styles["Rodape"],
    ))

    doc.build(elementos)

    print(f"PDF gerado: {nome_pdf}")
    return nome_pdf