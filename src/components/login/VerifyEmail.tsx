import * as React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom'

interface IVerifyEmailProps {
}

const VerifyEmail: React.FunctionComponent<IVerifyEmailProps> = (props) => {

  return (
    <>
    <br />
      <div className="w-screen h-screen" id="fullscreen">
        <div className="absolute inset-0">
          <img className="object-cover w-full h-full" src="https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80&sat=-100" alt="A computer background" />
          <div className="absolute inset-0 bg-indigo-700 mix-blend-multiply"></div>
        </div>
        <div className="relative" id="relative">
          <div className="px-2 py-2 mx-auto my-auto max-w-7xl md:max-h-2xl md:py-6">
            <h1 className="text-4xl text-white md:text-5xl">Verifica tu correo</h1>
            <p className="pt-2 text-2xl text-gray-100 md:text-3xl md:pt-3">
              Mientras tanto, nos encantaría que comenzara ahora mismo, todavía necesitamos que verifique su correo electrónico. Una vez hecho esto, ¡que comience la diversión!
            </p>
          </div>
          <br />
          <Link to='/'> <button className="focus:ring-2 focus:ring-offset-2 focus:ring-green-700 text-sm font-semibold leading-none text-white focus:outline-none bg-pink-700 border rounded hover:bg-purple-600 py-3 w-40"> Regresar </button></Link>
        </div>
      </div>
    </>
  )
};

export default VerifyEmail;
