import './signIn.css';
import logo from './images/logo.png';
function SignIn() {
    return (
      <div className="signin" class='flex bg-yellow-500 h-[600px] mt-2 justify-around items-center' >
        <div className='leftaside' class='h-[550px] w-[45%] bg-white flex flex-col justify-evenly' >
        <img src={logo} class='h-[45px] w-[140px]' ></img>
        <div className='inputtext' >
          <h2 class='font-bold text-xl' >Welcome Back!</h2>
          <p class='text-zinc-400'>Enter your email and password</p>
          </div>
          <div className='input' class='h-[150px] w-[300px] flex flex-col items-center justify-around bg-red-500' >
          <input type="text" name="email" placeholder='Email Address'class='h-10' />
          <input type="text" name="password" placeholder='Password'class='h-10' />
          </div>
          <div className='checkbox' class='flex' >
          <input type="checkbox"  name="checkbox"/>
          <p>Remember me</p>
          <p>Forget Password?</p>
          </div>
          <div className='button'>
          <button type='submit'>SIGN IN</button>
          </div>
          <div className='decription' class='flex' >
          <p>Dont have an account?</p>
          <a href='#'>SignUp</a>
          </div>
        </div>
        <div className='rightaside' class='bg-white w-[45%] h-[550px]'  ></div>
      </div>
    );
  }

  export default SignIn ;