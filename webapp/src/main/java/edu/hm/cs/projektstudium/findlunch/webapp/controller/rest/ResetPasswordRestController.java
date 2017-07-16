package edu.hm.cs.projektstudium.findlunch.webapp.controller.rest;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import edu.hm.cs.projektstudium.findlunch.webapp.logging.LogUtils;
import edu.hm.cs.projektstudium.findlunch.webapp.mail.MailService;
import edu.hm.cs.projektstudium.findlunch.webapp.model.ResetPassword;
import edu.hm.cs.projektstudium.findlunch.webapp.model.User;
import edu.hm.cs.projektstudium.findlunch.webapp.repositories.ResetPasswordRepository;
import edu.hm.cs.projektstudium.findlunch.webapp.repositories.UserRepository;

/**
 * The Class ResetPasswordRestController.
 * The Class is responsible for handling API calls to reset the password.
 * 
 * @author Deniz Mardin
 *
 */
@RestController
public class ResetPasswordRestController {

	@Autowired
	UserRepository userRepository;
	
	@Autowired
	private ResetPasswordRepository resetPasswordRepository;
	
	@Autowired
	private MailService mailService;
	
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;
	
	private static final String HTTP = "http://";
	
	private static final String HTTPS= "https://";
	
	private final Logger LOGGER = LoggerFactory.getLogger(ResetPasswordRestController.class);
	
	@CrossOrigin
	@RequestMapping(path ="api/get_reset_token", method = RequestMethod.POST)
	public ResponseEntity<Integer> getResetPassword(HttpServletRequest request, @RequestBody User user){
		LOGGER.info(LogUtils.getDefaultInfoString(request, Thread.currentThread().getStackTrace()[1].getMethodName()));
		
		User u = userRepository.findByUsername(user.getUsername());
		if(u == null){
			LOGGER.info(LogUtils.getErrorMessage(Thread.currentThread().getStackTrace()[1].getMethodName(),"Not existed Username(E-Mail) was entered."));
			//send always a success Mail because of IT-Sec reasons.Also add the difference of the needed time to send a Mail.
			return new ResponseEntity<>(0, HttpStatus.OK);
		}
		ResetPassword resetPasswordLast = resetPasswordRepository.findByUser(u);
		
		
		//try to reset pw more then one time in 24hours
		if(resetPasswordLast != null && validatePasswordDate(resetPasswordLast.getDate())){
			String resetLink = getPasswordResetUrl(request, u);
			try{
				mailService.sendResetPwMail(u,resetLink);
			}
			catch (Exception e) {
				e.printStackTrace();
			}
			
			return new ResponseEntity<>(0, HttpStatus.OK);
		}
		
		//first try to reset pw in 24h
		ResetPassword resetPassword = new ResetPassword();
		resetPassword.setDate(new Date());
		resetPassword.setToken(UUID.randomUUID().toString());
		resetPassword.setUser(u);
		u.setResetPassword(resetPassword);
		resetPasswordRepository.save(resetPassword);
		userRepository.save(u);
		String resetLink = getPasswordResetUrl(request, u);
		try{
			mailService.sendResetPwMail(u,resetLink);
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<>(0, HttpStatus.OK);
		
		/*
		LOGGER.info(LogUtils.getDefaultInfoString(request, Thread.currentThread().getStackTrace()[1].getMethodName()));

		User user = userRepository.findByUsername(u.getUsername());
		if(user !=null){
			ResetPassword resetPassword = new ResetPassword();
			resetPassword.setDate(new Date());
			resetPassword.setToken(UUID.randomUUID().toString());
			resetPassword.setUser(user);
			user.setResetPassword(resetPassword);
			resetPasswordRepository.save(resetPassword);
			userRepository.save(user);
			
			mailService.sendPasswordRestToken(user);
			return new ResponseEntity<>(0, HttpStatus.OK);
		}
		
		//should we send Http code 200 because of itsec
//		return new ResponseEntity<Integer>(1, HttpStatus.CONFLICT);
		return new ResponseEntity<>(0, HttpStatus.OK);*/
	}
	
	private boolean validatePasswordDate(Date dateToValidate){
		LocalDateTime dtv = LocalDateTime.ofInstant(dateToValidate.toInstant(), ZoneId.systemDefault());
		LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
		if (dtv.isAfter(yesterday))
			return true;		
		return false;
	}
	
	private String getPasswordResetUrl(HttpServletRequest request, User user) {
		String url = getProtocol(request.isSecure()) + request.getServerName()+":"+request.getServerPort()+"/resetpassword/"+user.getResetPassword().getToken();
		return url;
	}
	
	private String getProtocol(boolean https){
		return https ? HTTPS : HTTP;
	}

	@CrossOrigin
	@RequestMapping(path ="api/reset_password/{token}", method = RequestMethod.PUT)
	public ResponseEntity<Integer> resetPassword(@PathVariable("token") String token,/*@Valid*/ @RequestBody User u, HttpServletRequest request){
		LOGGER.info(LogUtils.getDefaultInfoString(request, Thread.currentThread().getStackTrace()[1].getMethodName()));
		
		ResetPassword rp = resetPasswordRepository.findByToken(token);
		if(rp !=null){
			User user = rp.getUser();
			if(u.getPassword() != null  && u.getPasswordconfirm() != null){
				if(user != null && u.getPassword().equals(u.getPasswordconfirm())){
					user.setPassword(passwordEncoder.encode(u.getPassword()));
					user.setPasswordconfirm(passwordEncoder.encode(u.getPasswordconfirm()));
					userRepository.save(user);
					resetPasswordRepository.delete(rp);
					return new ResponseEntity<>(0, HttpStatus.OK);
				}
			}
		}
		//should we send Http code 200 because of itsec
//		return new ResponseEntity<Integer>(1, HttpStatus.CONFLICT);
		return new ResponseEntity<>(0, HttpStatus.OK);
	}
}
