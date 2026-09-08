import { PropagateLoader } from "react-spinners";
import "../assets/scss/Loader.scss"

const Loader = () => {
    return (
        <>

            <div className="loader">

                <PropagateLoader color="#027a36" />
            </div>

        </>
    )
}

export default Loader