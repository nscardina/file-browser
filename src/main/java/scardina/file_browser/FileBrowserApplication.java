package scardina.file_browser;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;

public class FileBrowserApplication extends Application {

    @Override
    public void start(Stage stage) throws IOException {
        var loader = new FXMLLoader(FileBrowserApplication.class.getResource("main-view.fxml"));

        var scene = new Scene(loader.load(), 640, 480);
        scene.getStylesheets().add("scardina/file_browser/main-view.css");

        stage.setTitle("File Browser");
        stage.setScene(scene);

        stage.show();
    }

    public static void main(String[] args) {
        launch();
    }

}
