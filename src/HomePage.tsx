import SideBarComponent, { type MembersInfo} from "./sidebar/SideBarComponent";
import firstUser from './assets/firstUser.svg'
import secondUser from './assets/secondUser.svg'
import thirdUser from './assets/thirdUser.svg'

export const mockMembersList: MembersInfo[] = [
    { url: firstUser, online: false, username: 'Diana'},
    { url: secondUser, online: true, username: 'Tie'},
    { url: thirdUser, online:false, username: 'Ryan'},
    { url: '', online: true, username: 'Sam'}
]

function HomePage() {
  return (
    <div>
      <SideBarComponent members = {mockMembersList} />
    </div>
  );
}

export default HomePage;