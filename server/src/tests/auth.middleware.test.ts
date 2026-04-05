import { isUserLoggedIn , isAdminLoggedIn } from "../middleware/auth.middleware";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model";

jest.mock("jsonwebtoken");
jest.mock("../models/user.model");

describe("Auth Middleware" , ()=>{
  let req : any ;
  let res : any ;
  let next : any ;

  beforeEach(()=>{
    req = {cookies : {}} ;
    res = {
      status : jest.fn().mockReturnThis() , 
      json : jest.fn() 
    };
    next = jest.fn();
  });

  describe("isUserLoggedIn" , ()=>{
    it("should return 401 if no token", async()=>{
      await isUserLoggedIn(req , res ,next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success : false , 
        message : "Token not Found"
      });
    });

    it("should call next with the error if jwt fails" , async()=>{
      req.cookies.token = "fakeToken";

      (jwt.verify as jest.Mock).mockImplementation(()=>{
        throw new Error("Invalid token");
      })

      await isUserLoggedIn(req, res , next);

      expect(next).toHaveBeenCalled();
    })

    it("should return 401 if user not found", async()=>{
      req.cookies.token = "validToken";

      (jwt.verify as jest.Mock).mockReturnValue({
        email : "test@test.com"
      });

      (userModel.findOne as jest.Mock).mockReturnValue({
        select : jest.fn().mockResolvedValue(null)
      });

      await isUserLoggedIn(req , res , next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should call next and attach user if valid" , async()=>{
      req.cookies.token = "ValidToken";
      (jwt.verify as jest.Mock).mockReturnValue({
        email : "test@test.com"
      });

      const mockUser = {email : "test@test.com"};

      (userModel.findOne as jest.Mock).mockReturnValue({
        select : jest.fn().mockResolvedValue(mockUser)
      });

      await isUserLoggedIn(req  ,res , next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    })
  });
});