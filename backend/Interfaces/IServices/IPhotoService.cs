using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet.Actions;

namespace Backend.Interfaces.IServices
{
    public interface IPhotoService
    {
        Task<ImageUploadResult> AddPhotoAsync(IFormFile file, string folderName, bool isAvatar);
        Task<DeletionResult> DeletePhotoAsync(string publicId);
    }
}