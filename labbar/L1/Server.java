import java.io.*;
import java.net.*;
import java.util.*;

public class Server extends Thread{
  public static  ArrayList<ConnectionHandler> CurrentUsers =  new ArrayList<ConnectionHandler>();
  public static int port;

  public Server(int p){
    this.port = p;
  }

  public ArrayList<ConnectionHandler> getUsers(){
    return CurrentUsers;
  }


  //These two methods lock on the same object, meaning that different threads can not run any combination of them concurrently. Which is what we want.
  public synchronized void addConnection(ConnectionHandler c){
    CurrentUsers.add(c);
    System.out.print("Active Connections " + CurrentUsers.size() + "\n");
  }

  public synchronized void removeConnection(ConnectionHandler c){
    CurrentUsers.remove(c);
    System.out.print("Active Connections " + CurrentUsers.size() + "\n");
  }


//Start server and wait for connections. Each connection run as a separate thread. 
@Override
  public void run(){

    try {
      ServerSocket serverSocket = new ServerSocket(port);
      Socket clientSocket;
      System.out.print("Server running. Waiting for connections.." + "\n");

      while((clientSocket = serverSocket.accept()) != null){
        System.out.print("Pending connection from " + clientSocket + "\n");
        Thread h =  new Thread(new ConnectionHandler(this, clientSocket));
        h.start();      
        }

        serverSocket.close();
      }
     catch(IOException e){e.printStackTrace();}



  }




}
