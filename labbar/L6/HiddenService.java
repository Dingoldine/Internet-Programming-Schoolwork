import java.io.*;
import java.net.*;

public class HiddenService {

	/* This is just a server listening for a connection and sending back a respnse of hello world
	This is the link to the onion service configured by using tor, and modifying the torrc file
		

	64ygu6suivseweky.onion

	*/

	public static void main(String[] args) throws Exception{

		//port to where the server will listen
		int port = 8080; 

		try {


				ServerSocket ss = new ServerSocket(port);
				Socket clientSocket;
				System.out.print("Server started .. ");
				//accept a connection, for now can only handle one at a time
				clientSocket = ss.accept();
				System.out.print("Connection from " + clientSocket + "\n");

				//load the index.html file that will later be sent to the client as a response
				File f = new File("index.html");

				//intitate the input and outputstreams
				PrintStream response = new PrintStream(clientSocket.getOutputStream(), true);
		        BufferedReader request = new BufferedReader(
						new InputStreamReader(
								clientSocket.getInputStream()));
		        String inputLine, outputLine;


				//print clients request, send back html as a response
				String requestHeader;
				while((requestHeader = request.readLine()) != null){
						System.out.println(requestHeader);
						String str;

						while((str = request.readLine()) != null && str.length() > 0){
								System.out.println(str);
						}

						//the HTTP response sent to client after a request 
						response.flush();
						response.println("HTTP/1.1 200 OK");
						response.println("Content-Type: text/html");
						response.println("Accept Ranges: bytes");
						response.println("Connection: Keep-Alive");
						response.println("Keep-Alive: timeout=100, max=1000");
						response.println("Content-Length:" + f.length());
						response.println();

						
						FileInputStream infil = new FileInputStream(f);
						byte[] b = new byte[1024];

						while( infil.available() > 0){
						response.write(b,0,infil.read(b));
						}

				}	
				//close the socket connection after client disconnects
				clientSocket.close();
			
		}

		//catching errors
		catch(Exception e)
		{

			System.out.println(" Exception occurred: " + e);
			e.printStackTrace();
		}

	}

}