const HEAD = (
    <div style={{
        width: "36px",
        height: "40px",
        borderRadius: "100%",
        border: "7px solid black",
        position: "absolute",
        top: "50px",
        right: "205px"

    }}  />
)
const BODY = (
    <div style={{
        width: "7px",
        height: "50px",
        background: "black",
        position: "absolute",
        top: "92px",
        right: "220px"

    }}  />
)
const LEFT_ARM = (
    <div style={{
        width: "50px",
        height: "7px",
        background: "black",
        position: "absolute",
        rotate: "30deg",
        top: "95px",
        right: "220px",
    }}  />
)
const RIGHT_ARM = (
    <div style={{
        width: "50px",
        height: "7px",
        background: "black",
        position: "absolute",
        rotate: "-30deg",
        top: "95px",
        right: "175px"

    }}  />
)
const LEFT_LEG = (
    <div style={{
        width: "50px",
        height: "7px",
        background: "black",
        position: "absolute",
        rotate: "-30deg",
        top: "150px",
        right: "220px",
    }}  />
)
const RIGHT_LEG = (
    <div style={{
        width: "50px",
        height: "7px",
        background: "black",
        position: "absolute",
        rotate: "30deg",
        top: "150px",
        right: "175px"

    }}  />
)
const BODY_PARTS = [HEAD,BODY,LEFT_ARM,RIGHT_ARM,LEFT_LEG,RIGHT_LEG]

// eslint-disable-next-line react/prop-types
const HangmanDrawing = ({ isOpponent, numberOfGuesses = 6} ) => {
    // console.log(wrongGuesses);
    return (
        <div style={{position: 'relative', pointerEvents: isOpponent ? 'none' : 'auto'}}>
            {BODY_PARTS.slice(0,numberOfGuesses)}
            <div className="verticalShort_stick" />
            <div className="horizontal_stick" />
            <div className="vertical_stick" />
            <div className="stand" />
        </div>
    )
}


export default HangmanDrawing;