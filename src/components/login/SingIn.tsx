import * as React from 'react';

interface ISingInProps {
}

const SingIn: React.FunctionComponent<ISingInProps> = (props) => {
    return (
        <div>
            <h1>Registrarse</h1>
            <form>
                <div>
                    <label htmlFor="username">Email</label>
                    <input type='text' name='Email' value='x' />
                </div>

                <br />

                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input type="password" name="constraña" value='x' />
                </div>

                <br />

                <button>Registrarse</button>

            </form>
        </div>
    )
};

export default SingIn;
