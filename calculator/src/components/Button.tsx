export interface ButtonProps {
	button: {
		id: string,
		btnRole: string,
		btnSymbol: string,
		btnStyle: React.CSSProperties
	},
	fnClick: () => void
}

function Button({ button, fnClick }: ButtonProps) {
	const { id, btnSymbol, btnStyle } = button;

	return (
		<div className="btn-elegant" id={id} style={btnStyle} onClick={fnClick}>
			{btnSymbol}
		</div>
	)
}

export default Button