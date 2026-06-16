import '../../css/feedback.css';


export default function FeedbackAluno() {
	return (
    <div className="feedback-container">
		<h1 id="title">Visualize aqui o seu feedback!</h1>
		<nav>
			<ul>
				<li><button id="botaofeedback" onClick={() => window.open("Em desenvolvimento!", "_blank")}>Gerar relatório</button></li>
			</ul>
		</nav>
	</div>
	)
}

