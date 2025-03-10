# import os
# import re

# def clean_assets_folder(folder_path):
#     """
#     Keeps only one .png file per team in the specified folder. 
#     Assumes each file name contains the team name in a recognizable format.
#     """
#     # A helper function to get a uniform "team name" from filename
#     # Here, we’re just removing non-alphabetic characters to standardize the name
#     # If your filenames follow a specific pattern (e.g., Lakers1.png, Lakers_2.png),
#     # you can adjust the logic to reliably extract the team name.
    
#     def get_team_name(filename):
#         # Remove file extension
#         name_without_ext = os.path.splitext(filename)[0]
#         print(name_without_ext)
#         if name_without_ext[:3] != 'nba':
#             return name_without_ext.lower()
#         # Example transformation: remove non-alphabetic chars, convert to lowercase
#         # So "lakers1.png" -> "lakers"
#         # You can tune this depending on your filename structure
        
#         # return re.sub(r'[^a-zA-Z]', '', name_without_ext).lower()

#     # Dictionary to keep track of which team we’ve encountered 
#     # and the *first* file we decide to keep
#     existing_teams = {}

#     # Iterate over all items in the folder
#     for entry in os.scandir(folder_path):
#         print(entry)
#         if entry.is_file() and entry.name.lower().endswith('.png'):
#             team_name = get_team_name(entry.name)

#             # If we haven't seen this team yet, record this file as the "keeper"
#             # Otherwise, delete the file
#             if team_name not in existing_teams:
#                 existing_teams[team_name] = entry.name
#                 print(f"Keeping: {entry.name}")
#             else:
#                 # This is a duplicate for an existing team, so remove it
#             # if list(entry.name)[:3] != 'nba':
#                 os.remove(entry.path)
#                 print(f"Deleting non-nba: {entry.name}")

# assets_folder = "assets"
# clean_assets_folder(assets_folder)
# print("Cleanup complete!")

# import os

# def remove_non_nba_files(folder_path):
#     """
#     Removes all files in folder_path that do NOT start with 'nba' (case-insensitive).
#     """
#     for filename in os.listdir(folder_path):
#         # Full path to the file
#         file_path = os.path.join(folder_path, filename)
        
#         # Only act on files (skip directories, if any)
#         if os.path.isfile(file_path):
#             # If the filename does NOT start with 'nba'
#             if not filename.lower().startswith("nba"):
#                 print(f"Removing file: {filename}")
#                 os.remove(file_path)
#             else:
#                 print(f"Keeping file:  {filename}")

# if __name__ == "__main__":
#     folder = "assets"  # Change this to your actual folder path
#     remove_non_nba_files(folder)
#     print("Cleanup complete!")

# import os

# def keep_only_150x150_files(folder_path):
#     """
#     Removes all files in folder_path that do NOT contain '150x150' (case-insensitive).
#     """
#     for filename in os.listdir(folder_path):
#         file_path = os.path.join(folder_path, filename)
#         # Only act on files (skip directories, if any)
#         if os.path.isfile(file_path):
#             # If "150x150" is not in the filename
#             if "150x150" not in filename.lower():
#                 os.remove(file_path)
#                 print(f"Removed file: {filename}")
#             else:
#                 print(f"Kept file:   {filename}")

# if __name__ == "__main__":
#     folder = "assets"  # Replace with your actual folder path
#     keep_only_150x150_files(folder)
#     print("Cleanup complete!")

import os
import re

def rename_nba_files(folder_path):
    for filename in os.listdir(folder_path):
        # Full path to the file
        full_path = os.path.join(folder_path, filename)
        
        # Only process files (skip directories)
        if not os.path.isfile(full_path):
            continue
        
        # Separate base name and extension
        name, ext = os.path.splitext(filename)
        
        # 1. Remove 'nba' prefix (case-insensitive), optionally followed by a dash or underscore
        #    e.g. "nba-minnesota..." -> "minnesota..."
        name = re.sub(r'(?i)^nba[-_]?', '', name)
        
        # 2. Find "logo" (case-insensitive) and cut off everything after it (keep "logo")
        match = re.search(r'(?i)logo', name)
        if match:
            # Keep everything from the start of `name` up to the end of "logo"
            end_idx = match.end()  # index just after "logo"
            name = name[:end_idx]
        
        # Construct the new filename
        new_filename = name + ext
        
        # Generate full path for the new filename
        new_full_path = os.path.join(folder_path, new_filename)
        
        # Rename the file (be careful with existing files of the same name)
        os.rename(full_path, new_full_path)
        print(f'Renamed: "{filename}" -> "{new_filename}"')

if __name__ == "__main__":
    # Change to your folder path
    folder = "assets"
    rename_nba_files(folder)
    print("Renaming complete!")
