interface displayProps {
    preview: string,
    display: string
}

function Display({ preview, display }: displayProps) {
    return (
        <div className="display-container">
            <p id="preview">{preview}</p>
            <p id="display">{display}</p>
        </div>
    )
}

export default Display