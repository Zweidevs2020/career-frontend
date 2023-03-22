import './signIn.css';
import logo from './images/logo.png';
function SignIn() {
    return (
      <div className="signin" class='flex  h-[600px] mt-2 justify-evenly items-center' >
        <div className='leftaside' class='h-[550px] w-[45%] bg-white flex flex-col' >
          <div className='logo' class='h-[70px] w-[90%]  flex items-center ml-2' >
          <img src={logo} class='h-[45px] w-[140px]' ></img>
          </div>
          <div className='input-field' class='h-[400px] w-[90%] flex flex-col justify-evenly items-center'>
          <div className='text' class='h-[70px] w-[60%]  flex flex-col justify-center' >
          <h2 class='font-bold text-xl ml-2' >Welcome Back!</h2>
          <p class='text-zinc-400 ml-2'>Enter your email and password</p>
           </div>
           <div className='input' class='h-[130px] w-[60%] flex flex-col justify-around' >
          <input type="text" name="email" placeholder='Email Address'class='h-10 w-[95%] ml-2 border-2 border-slate-600 rounded-md' />
          <input type="text" name="password" placeholder='Password'class='h-10 w-[95%] ml-2 border-2  border-slate-600 rounded-md' />
          </div>
          <div className='checkbox' class='h-[40px] w-[60%] flex items-center justify-between mb-5' >
            <div class='flex ml-2'>
          <input type="checkbox"  name="checkbox"/>
          <p>Remember me</p>
          </div>
          <div>
          <p>Forget Password?</p>
          </div>
          </div>
          <div className='button'class='h-[50px] w-[60%] flex items-center justify-center' >
          <button class='h-[40px] w-[60%] bg-[#1476B7] text-white rounded-md' >SIGN IN</button>
          </div>
          <div className='decription' class='flex' >
          <p>Dont have an account?</p>
          <a href='#'>SignUp</a>
          </div>
          </div> 
        </div>
        <div className='rightaside' class='bg-[#1476B7] w-[45%] h-[550px] rounded-md'  >
        </div>
      </div>
    );
  }

  export default SignIn ;