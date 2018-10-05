import java.net.*;
import java.io.*;

public class Client implements Runnable{
	private static InputStream InputStream;
	private static OutputStream OutputStream;
	private static boolean connection_closed = false;
	private static PrintStream outToServer;
	private static BufferedReader indata;
	private String sendFileInfo;
	private String downloadInformation;

    public static void main(String[] args){

	try{
	   	//Socket socket = new Socket("leguin.csc.kth.se",1234); 
	    Socket socket = new Socket("130.237.227.10",1234); 
	    InputStream = socket.getInputStream();
   		OutputStream = socket.getOutputStream();

	    outToServer = new PrintStream(OutputStream); 
	    indata = new BufferedReader(new InputStreamReader(System.in)); 

	  

	  	//create a thread that reads from server
	   	new Thread(new Client()).start();


	   	//read from terminal
	   	String text;
	   	while(!connection_closed){
	    text = indata.readLine().trim();
	   	outToServer.println(text);
	    }
	    
	    indata.close();
	    outToServer.close();
	    socket.close(); 
	}
	catch (Exception e){ System.err.println("Ett fel intraffade!"); }
    }



    //Reads server output, If special messages starts new thread for download or opening a socket.
    @Override 
    public void run(){
    	try{
    	String response;
    	BufferedReader inFromServer = new BufferedReader(new InputStreamReader(InputStream));
    	while((response = inFromServer.readLine()) != null){
    		
    		if (response.startsWith("/OPEN_SOCKET/")){
    			this.sendFileInfo = response;

    			Thread aThread = new Thread(new Runnable() {
      				public void run() {
      					String[] tokens = sendFileInfo.split("/");
      					String fileName = tokens[2];
          				outToServer.flush();
           				openSocket(outToServer, fileName);
   				  }		
				});
		 		aThread.start();
    		}
    		else if (response.startsWith("/DOWNLOAD/")){
    			this.downloadInformation = response;

    			Thread anotherThread = new Thread(new Runnable() {
      				public void run() {
      					String[] tokens = downloadInformation.split("/");
      					String ip_adress = tokens[2];
 						int port_number = Integer.parseInt(tokens[3]);
           				Download(ip_adress, port_number);
   				  }		
				});
		 		anotherThread.start();
    		}
    		else{
    		System.out.print(response  + "\n");
    		}
    	}
    	connection_closed = true;
    }
    	catch (Exception e){e.printStackTrace();};
		
		}	


	//Open a socket and write a file to send to the outputstream
 	public void openSocket(PrintStream o, String f){
 		PrintStream out = o;
 		int port;
 		Socket clientSocket;

 		try {
      	ServerSocket serverSocket = new ServerSocket(0);
      	port = serverSocket.getLocalPort();
      	out.println(port);

      	clientSocket = serverSocket.accept();
        System.out.println("Sending file ... ");

        File file = new File(f);
    	FileInputStream infil = new FileInputStream(f);
    	byte[] b = new byte[1024];
    	DataOutputStream dos = new DataOutputStream(clientSocket.getOutputStream()) ;
    	while( infil.available() > 0){
			dos.write(b,0,infil.read(b));
   		 }
   		System.out.println("Done!");
   		dos.close();
   		infil.close();
     
        
     	 }
     	catch(IOException e){e.printStackTrace();}

 }

 	//Connect to a another clients serversocket to and read inputsteam, write to a file ouput stream saved as download.png. 
 	public void Download(String ip, int port){

 		try{
 		Socket downloadSocket = new Socket(ip ,port);

 		DataInputStream dis = new DataInputStream(downloadSocket.getInputStream());
		FileOutputStream fos = new FileOutputStream("download.png");
		byte[] buffer = new byte[1024];
		
		System.out.println("Dowloading file ... ");
		int read = 0;
		while((read = dis.read(buffer)) > 0) {
			fos.write(buffer, 0, read);
		}
		System.out.println("Done!");


		dis.close();
		fos.close();
		downloadSocket.close();
 		}
 		catch(IOException e){e.printStackTrace();}

 
 	}

}

