using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Auth
{
    public class UploadAvatarDto
    {
        public IFormFile File { get; set; } = null!;
    }
}