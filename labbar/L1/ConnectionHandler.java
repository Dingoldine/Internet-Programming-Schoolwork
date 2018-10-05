import java.io.*;
import java.net.*;
import java.util.*;
import java.lang.*;

  public class ConnectionHandler implements Runnable{

  private static Socket socket;
  private static Server server;
  private PrintStream outToClient;
  private InputStream InputStream;
  public OutputStream OutputStream;

  private boolean login_successfull = false;
  public  String username;
 
  //File transfer variables
  public String filename;
  public boolean AwaitingResponse = false;
  public ConnectionHandler sender;
  public ConnectionHandler reciever;
  public boolean AwaitingPortNumber = false;



  public Socket getSocket(){
  	return socket;
  }

  public ConnectionHandler(Server ser, Socket s){
  		this.socket = s;
  		this.server = ser;
  }


   @Override
  public void run(){

  	System.out.println("Running as: " + Thread.currentThread().getName());
  	 try{
              handleClient();
           }

            catch(IOException e){e.printStackTrace();}

	   }

	//<login> <username>
	public void loginProcedures(String[] s){
		
		
		if (s.length != 2){
			String msg = "unknown format, login unsuccesfull";
			sendMessage(msg);
		}

		else 
			this.login_successfull = true;
			this.username = s[1].trim();

			server.addConnection(this);

			String msg = "LOGIN SUCCESSFULL! Welcome " + username;
			outToClient.println(msg);
			
			//send to all that you logged in as Username
			ArrayList<ConnectionHandler> clients = server.getUsers();
			String update = username + " connected to the chatroom";
			for (ConnectionHandler client : clients) {
				if (client.username != username){
					client.sendMessage(update);
				}
				}
			
		//send to client information about what users are currently online
		sendMessage("Online users: ");
		String online_user;
		for (ConnectionHandler client : clients) {
			if (client.username != username){
				online_user = client.username;
				sendMessage(online_user);
			}

		}

		sendMessage("Commands: quit -> logoff, pm username -> private message, sendf username -> send binary file");
		
	}

	public void logoffProcedures() throws IOException{
		server.removeConnection(this);
		String msg = "Signing off ... Goodbye "+ username;
		sendMessage(msg);

		//send to all that user went offline
		ArrayList<ConnectionHandler> clients = server.getUsers();
		String update = username + " is offline";
		for (ConnectionHandler client : clients) {
			client.sendMessage(update);
		}

	}

	////private message 
	//<pm><reciever><text>
	private void PrivateMessageProcedures(String m, String[] t){

		boolean found = false;
		String reciever = t[1].trim();
		String msg = t[2].trim();

		
		ArrayList<ConnectionHandler> clients = server.getUsers();
			for (ConnectionHandler client : clients) {
				if (client.username.equals(reciever)){
					client.sendMessage(username + ": " + msg); 
					found = true;
				}
			}

			if(!found){sendMessage("Error: A user with that username is not currently connected.");}
		
			}


	//global message 
	private void GlobalMessageProcedures(String m){
		String msg = m; 
		ArrayList<ConnectionHandler> clients = server.getUsers();
		 for (ConnectionHandler client : clients) {
		 	if (client.username != username){client.sendMessage(username + ": " + msg);}
		 	else sendMessage("You: " + msg);

		 }

	}


	//File transfer communication between clients
	private void FileTransfer(String m, String[] t){
		boolean found = false;
		String reciever = t[1].trim();
		if (t.length == 3){

		ArrayList<ConnectionHandler> clients = server.getUsers();
		 for (ConnectionHandler client : clients) {
		 	if (client.username.equals(reciever)){
		 		//set the connection between sender reciever, one can reach the other
		 		client.sender = this;
		 		this.reciever = client;
		 		found = true;
		 		client.filename = t[2];
		 		client.sendMessage(username + " wants to send the file " + client.filename + " to you. Accept? Yes/No");
		 		client.AwaitingResponse = true;


		 	}

			}
			if(!found){sendMessage("Error: A user with that username is not currently connected.");}
		}
		else
			sendMessage("Error: Wrong format <sendf>>reciever><filename>.");
		}	

	
   //Handles Communication with the client, 
   public void handleClient() throws IOException{
  		InputStream = socket.getInputStream();
  	    OutputStream = socket.getOutputStream();
   		this.outToClient = new PrintStream(OutputStream); 	



   		String instructions = "Welcome to the chatroom, Login by typing 'login' followed by a nickname";
   		sendMessage(instructions);
   		

         BufferedReader indata = new BufferedReader(new InputStreamReader(InputStream));
         String text;


         while((text = indata.readLine()) != null){

         String[] tokens = text.split(" ", 3);

         String command = tokens[0];

         //log-in
         if (command.equalsIgnoreCase("login") && login_successfull == false){
         	loginProcedures(tokens);
         }	

         //log-off
         else if (command.equalsIgnoreCase("quit")){
         	logoffProcedures();
         	break;
         }

         //Client need to log in and set a username in order to send messsages, 
         else if (login_successfull == true){

         	//Check if server is awaiting a portnumber from the client to pass on to the reciever of the file.
         	 if (AwaitingPortNumber){
        		String portNumber = text;
        		String trigger = "/DOWNLOAD/" + socket.getInetAddress().getHostAddress() + "/" + portNumber;
        		reciever.sendMessage(trigger);
        		AwaitingPortNumber = false;
	
        	}

        	//Check if client requested to send a private message 
        	else if (command.equalsIgnoreCase("pm")){ 
        	 PrivateMessageProcedures(text, tokens);
        	 }
        	 
        	//Check if client requested to send a file 
        	else if (command.equalsIgnoreCase("sendf")){
        			FileTransfer(text, tokens);
        	}

        	//Check if client has been sent a file, in that case if its a valid answer.
        	else if (command.equalsIgnoreCase("yes") && AwaitingResponse){
        		sender.AwaitingPortNumber = true;
        		AwaitingResponse = false;
        		String trigger_message = "/OPEN_SOCKET/" + filename;
        		sendMessage("You accepted the file");
        		sender.sendMessage("Your file transfer request was accepted");
        		sender.sendMessage(trigger_message);

        	}

        	//Check if client has been sent a file, in that case if its a valid answer.
        	else if (command.equalsIgnoreCase("no") && AwaitingResponse){
        		sendMessage("You denied the file");
        		sender.sendMessage("Your file transfer request was denied");
        		AwaitingResponse = false;
        		sender.AwaitingResponse = false;
        	}

        	//if none of the above it is a global message
        	else
        		GlobalMessageProcedures(text);	

         }

         else{ 
         String msg = "You need to log in by typing 'login' and a name, or quit by typing quit";
         sendMessage(msg);
     	}


        }

        OutputStream.close();
        InputStream.close();
        //socket.close();

   }

   public void sendMessage(String m){
   	outToClient.println(m);

   }


}