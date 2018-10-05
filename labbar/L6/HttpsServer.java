
import javax.net.ssl.*;
import java.io.*;
import java.security.*;

//import com.sun.net.ssl.*;
//import com.sun.net.ssl.internal.ssl.Provider;


public class HttpsServer {

	/**
	 * @param args
	 */

	public static void main(String[] args) throws Exception{

		//port to where the server will listen
		int port = 8080; 
		char ksPass[] = "MY_PASSWORD".toCharArray();
     	char ctPass[] = "MY_PASSWORD".toCharArray();

 

		System.setProperty("javax.net.ssl.trustStore", "myKeystore");
		System.setProperty("javax.net.ssl.trustStorePassword", "MY_PASSWORD");
		System.setProperty("javax.net.ssl.keyStoreType", "pkcs12");

		try {

			//set up java keystore
			KeyStore ks = KeyStore.getInstance("PKCS12");
         	ks.load(new FileInputStream("./keyStore/myKeystore.p12"), ksPass);

         	KeyManagerFactory kmf = 
         	KeyManagerFactory.getInstance("SunX509");
         	kmf.init(ks, ctPass);
         	SSLContext sc = SSLContext.getInstance("TLS");
         	sc.init(kmf.getKeyManagers(), null, null);



				// Initialize the SSL Server Socket
			SSLServerSocketFactory ssf = sc.getServerSocketFactory();
         	SSLServerSocket sslServerSocket 
            = (SSLServerSocket) ssf.createServerSocket(port);
         	System.out.println("Server started:");


				printServerSocketInfo(sslServerSocket);

				//accept a connection, for now can only handle one at a time
				SSLSocket sslSocket = (SSLSocket)sslServerSocket.accept();

				printSocketInfo(sslSocket);


				//intitate the input and outputstreams
				BufferedWriter response = new BufferedWriter(
					new OutputStreamWriter(sslSocket.getOutputStream()));
		        
		        BufferedReader request = new BufferedReader(
					new InputStreamReader(
							sslSocket.getInputStream()));


				//print clients request header, send back html as a response
				String m = request.readLine();
		        response.write("HTTP/1.0 200 OK");
		        response.newLine();
		        response.write("Content-Type: text/html");
		        response.newLine();
		        response.newLine();
		        response.write("<html><body>Hello world!</body></html>");
		        response.newLine();
		        //cleanup
		        response.flush();
		        response.close();
		        request.close();
		        sslSocket.close();

						// //the HTTP response sent to client after a request 
						// response.write("HTTP/1.1 200 OK");
						// request.newLine();
						// response.write("Content-Type: text/html");
						// response.write("Accept Ranges: bytes");
						// response.write("Connection: Keep-Alive");
						// response.write("Keep-Alive: timeout=100, max=1000");
						// response.write("Content-Length:" + f.length());
						// response.write();
						
				}	
		//catching errors
		catch(Exception e)
		{

			System.out.println(" Exception occurred: " + e);
			e.printStackTrace();
		}

	}

	private static void printSocketInfo(SSLSocket s) {
      System.out.println("Socket class: "+s.getClass());
      System.out.println("   Remote address = "
         +s.getInetAddress().toString());
      System.out.println("   Remote port = "+s.getPort());
      System.out.println("   Local socket address = "
         +s.getLocalSocketAddress().toString());
      System.out.println("   Local address = "
         +s.getLocalAddress().toString());
      System.out.println("   Local port = "+s.getLocalPort());
      System.out.println("   Need client authentication = "
         +s.getNeedClientAuth());
      SSLSession ss = s.getSession();
      System.out.println("   Cipher suite = "+ss.getCipherSuite());
      System.out.println("   Protocol = "+ss.getProtocol());
   }


      private static void printServerSocketInfo(SSLServerSocket s) {
      System.out.println("Server socket class: "+s.getClass());
      System.out.println("   Socket address = "
         +s.getInetAddress().toString());
      System.out.println("   Socket port = "
         +s.getLocalPort());
      System.out.println("   Need client authentication = "
         +s.getNeedClientAuth());
      System.out.println("   Want client authentication = "
         +s.getWantClientAuth());
      System.out.println("   Use client mode = "
         +s.getUseClientMode());
   }

}
