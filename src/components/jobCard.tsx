interface IJobCard { description: string }

const JobCard = ({description}:IJobCard) => {
  return (
    <>
    <p>A Job</p>
    <p>{description}</p>
    </>
  )
}

export default JobCard