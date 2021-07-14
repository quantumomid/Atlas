export default function AboutMember(props){
    return(
        <article>
        <img src={props.memberData.image} alt="Headshot of David" />
        <div>
        <h3>{props.memberData.fullName}</h3>
        <p>{props.memberData.description}</p>
        <a href={props.memberData.linkedIn}>LinkedIn</a>
        <a href={props.memberData.github}>GitHub</a>

        </div>
        </article>
    )
}