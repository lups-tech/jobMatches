import { useState } from "react"
import DevForm from "./DevForm"
import AllDevs from "./AllDevs"
import { Button } from "@mui/material"

const DevelopersMainRoute = () => {
    const [showForm, setShowForm] = useState(false)
    const handleShowForm = () => {
        setShowForm(!showForm)
    }
  return (
    <div className="flex flex-col justify-center">
    <Button onClick={handleShowForm}>{showForm? "Show Developers" : "Add a Developer"}</Button>
    {showForm && <DevForm/>}
    {!showForm && <AllDevs/>}
    
    </div>
  )
}

export default DevelopersMainRoute