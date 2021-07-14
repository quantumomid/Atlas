export default function AboutMember(props){
    return(
        <div className='overall-member-container'>
        <article className='member-container'>
        <h3 className='full-name'>{props.memberData.fullName}</h3>
        <div className="member-profile">
        <img src={props.memberData.image} alt={`Headshot of ${props.memberData.fullName}`} />
        <div className='member-info'>
        <p>{props.memberData.description}</p>
        <p>View <a href={props.memberData.linkedIn}>linkedIn</a> profile</p>
        <p>View <a href={props.memberData.github}>gitHub</a> profile</p>
        </div>
        </div>
        </article>
        </div>

    )
}