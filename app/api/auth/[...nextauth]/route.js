import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

const apiUrl = process.env.NEXT_PUBLIC_SITE_URL;

const handler = NextAuth({
    providers: [
      CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        async authorize(credentials) {
          console.log("authorize function invoked");
          try {

            const res = await fetch(apiUrl+ `/api/users/username/${credentials.username}`, {
              method: 'GET'
            });

            const user = await res.json();

            if (user && user.id && user.password) {
              // check password
              const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
  
              if (isPasswordCorrect) {
                return {
                  id: user.id,
                  name: user
                }
              } else {
                throw new Error("Wrong Credentials !");
              }
  
            } else {
              throw new Error(`User : ${user.username} not found`);
            }
  
          } catch (error) {
            throw new Error(error);
          }
        }
      }),
    
    ],
    pages: {
      error: "/"
    }
});

export { handler as GET, handler as POST };