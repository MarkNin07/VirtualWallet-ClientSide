import * as React from 'react';
import LogIn from './LogIn';
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
