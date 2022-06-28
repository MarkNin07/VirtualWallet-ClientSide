import * as React from 'react';
import LogIn from './LogIn';
import SingIn from './SingIn';
import VerifyEmail from './VerifyEmail';

interface IPagePpalProps {
}

const PagePpal: React.FunctionComponent<IPagePpalProps> = (props) => {
  return (
    <div>
        <LogIn/>        
    </div>
  )
};

export default PagePpal;
