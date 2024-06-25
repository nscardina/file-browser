module scardina.file_browser {
    requires javafx.controls;
    requires javafx.fxml;

    opens scardina.file_browser to javafx.fxml;
    exports scardina.file_browser;
}