import java.io.*;
import java.net.*;
import java.util.concurrent.ConcurrentHashMap;

public class HttpServer extends Thread{
	public static int port;
	public static ConcurrentHashMap<String, ConnectionHandler> sessions = new ConcurrentHashMap<String, ConnectionHandler>();

	public HttpServer(int p){
		this.port = p;
	}

	//Add connection to hasmap of existant cookies, to remember users
	public synchronized void addConnection(String s, ConnectionHandler c){
		sessions.put(s,c);
	}


	//Wait for connections
	public void run(){
		try{
			ServerSocket ss = new ServerSocket(port);
			Socket clientSocket;

			System.out.println("server started waiting for clients...");
			while((clientSocket = ss.accept()) != null){
				System.out.print("Connection from " + clientSocket + "\n");
			 	Thread t = new Thread(new ConnectionHandler(this, clientSocket));
			 	t.start();
			 }
		}
		catch(IOException e){e.printStackTrace();}
	}

    public static void main(String[] args) throws IOException{
		HttpServer server = new HttpServer(4711);
		server.start();
		

	}
}

