import SingleCard from "./SingleCard";

const UpcomingBooks = () => {
    return (
        <>

            <div className="container">

                <h1 className="text">New upcoming books</h1>
                <div className="picks-box">


                    <div className="l-side">
                        <div className="best-selling">
                            <SingleCard/>
                        </div>
                    </div>

                    

                </div>

            </div>



        </>
    )
}

export default UpcomingBooks;