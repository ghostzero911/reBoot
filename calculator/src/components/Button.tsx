export interface ButtonProps {
	button: {
		id: string,
		btnRole: string,
		btnSymbol: string,
		btnKey: string,
		btnStyle: React.CSSProperties
	},
	fnClick: () => void
}

function Button({ button, fnClick }: ButtonProps) {
	const { id, btnSymbol, btnKey, btnStyle } = button;

	return (
		<div className="btn-elegant" id={id} data-key={btnKey} style={btnStyle} onClick={fnClick}>
			{btnSymbol}
		</div>
	)
}

export default Button