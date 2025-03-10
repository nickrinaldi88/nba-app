import os
import re
from collections import defaultdict

print("test")

# Set your target folder
folder_path = "/Users/nickrinaldi/dev/assets"  # Change this to your actual folder path

# Function to extract prefix from filename (first 3-4 words)
def get_prefix(filename):
    words = filename.split('-')
    prefix = '-'.join(words[1:4])  # Skip 'nba' and keep the next 3 words
    return prefix

# Function to clean the filename (removing size and extra words)
def clean_filename(filename):
    words = filename.split('-')
    clean_name = '-'.join(words[1:-2])  # Skip 'nba' and remove last 2 parts (size + ext)
    return clean_name + ".png"

# Dictionary to hold grouped files
file_groups = defaultdict(list)

# Scan the folder
for file in os.listdir(folder_path):
    if file.endswith(".png"):
        prefix = get_prefix(file)
        file_groups[prefix].append(file)

# Process each group
for prefix, files in file_groups.items():
    # Sort files by size (descending) to keep the largest resolution
    files.sort(key=lambda f: os.path.getsize(os.path.join(folder_path, f)), reverse=True)
    
    # Pick the first (largest) file
    best_file = files[0]
    new_name = clean_filename(best_file)
    
    # Rename file
    old_path = os.path.join(folder_path, best_file)
    new_path = os.path.join(folder_path, new_name)
    os.rename(old_path, new_path)
    
    print(f"Renamed {best_file} → {new_name}")

print("Done processing files.")
