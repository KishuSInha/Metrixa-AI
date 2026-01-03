import subprocess
import platform
import os
import pyautogui

class ActionEngine:
    def __init__(self):
        self.os_type = platform.system()

    def run_command(self, cmd):
        """Runs a system command based on the OS."""
        try:
            if self.os_type == "Windows":
                # Use powershell for Windows
                result = subprocess.run(["powershell", "-Command", cmd], capture_output=True, text=True)
            else:
                # Use zsh/bash for Mac/Linux
                result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            
            if result.returncode == 0:
                return {"status": "success", "output": result.stdout}
            else:
                return {"status": "error", "message": result.stderr}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def open_app(self, app_name):
        """Opens an application."""
        if self.os_type == "Windows":
            return self.run_command(f"Start-Process '{app_name}'")
        elif self.os_type == "Darwin":  # macOS
            return self.run_command(f"open -a '{app_name}'")
        return {"status": "error", "message": "OS not supported"}

    def toggle_dark_mode(self, enabled=True):
        """Toggles Dark Mode (Windows and Mac supported)."""
        if self.os_type == "Windows":
            val = 0 if enabled else 1
            cmd = f"Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize' -Name 'AppsUseLightTheme' -Value {val}"
            return self.run_command(cmd)
        elif self.os_type == "Darwin":
            mode = "true" if enabled else "false"
            cmd = f"osascript -e 'tell application \"System Events\" to tell appearance preferences to set dark mode to {mode}'"
            return self.run_command(cmd)
        return {"status": "error", "message": "OS not supported"}

    def manage_files(self, action, path, target=None):
        """Basic file management: list, move, delete."""
        try:
            if action == "list":
                files = os.listdir(path)
                return {"status": "success", "data": files}
            elif action == "move":
                os.rename(path, target)
                return {"status": "success"}
            elif action == "delete":
                os.remove(path)
                return {"status": "success"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

engine = ActionEngine()
