import React from 'react'
import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";


function FooterCom() {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link to="/" className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Blog</span>
              Vibe
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-9 mt-8 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title='About' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='https://www.100jsprojects.com'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  100 js projects
                </Footer.Link>
                <Footer.Link
                  href='/about'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Blog Vibe
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title='Follow Us' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='https://github.com/baduk33'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Github
                </Footer.Link>
                <Footer.Link
                  href='https://www.linkedin.com/in/kunj-sharma-a39794234'
                >
                  LinkedIn
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title='Legal' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='/'
                >
                  Privacy Policy
                </Footer.Link>
                <Footer.Link
                  href='/'
                >
                  Terms &amp; Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

          </div>
        </div>

        <Footer.Divider />
        <div className=''>
          <Footer.Copyright href='/' by='Blog Vibe' year={new Date().getFullYear()} />

          <div className="flex gap-4 mt-2 sm:mt-5 sm:justify-center">
            <Footer.Icon href='https://github.com/baduk33' icon={FaGithub} />
            <Footer.Icon href='https://www.linkedin.com/in/kunj-sharma-a39794234' icon={FaLinkedin} />
          </div>
        </div>
      </div>
    </Footer>
  )
}

export default FooterCom