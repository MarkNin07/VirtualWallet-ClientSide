import * as React from 'react';

interface ILogInProps {
}

const LogIn: React.FunctionComponent<ILogInProps> = (props) => {
  return (
    <div>
        <h1>Iniciar Sesión</h1>
            <form>
                <div>
                    <label htmlFor="username">Email</label>
                    <input type='text' name='username' value='x' />
                </div>

                <br />

                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input type="password" name="password" value='x' />
                </div>

                <br />

                <button>Ingresar</button>

            </form>
    </div>
  )
};

export default LogIn;
