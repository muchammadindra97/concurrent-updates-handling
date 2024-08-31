package handler

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
)

type UtilBaseResponse struct {
	Status  bool   `json:"status"`
	Message string `json:"message"`
}

type UtilResponseData struct {
	UtilBaseResponse
	Data interface{} `json:"data"`
}

func UtilSendResponseErrorInternal(w http.ResponseWriter, err error) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.WriteHeader(http.StatusInternalServerError)
	json.NewEncoder(w).Encode(UtilBaseResponse{
		Status:  false,
		Message: "Internal server error",
	})
	fmt.Println(err.Error())
}

func UtilSendResponseErrorNotFound(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.WriteHeader(http.StatusNotFound)
	json.NewEncoder(w).Encode(UtilBaseResponse{
		Status:  false,
		Message: "Not found",
	})
}

func UtilSendResponseClientPreconditionRequired(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.WriteHeader(http.StatusPreconditionRequired)
	json.NewEncoder(w).Encode(UtilBaseResponse{
		Status:  false,
		Message: "Header if-match not found",
	})
}

func UtilSendResponseClientPreconditionFailed(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.WriteHeader(http.StatusPreconditionFailed)
	json.NewEncoder(w).Encode(UtilBaseResponse{
		Status:  false,
		Message: "Resource could be changed",
	})
}

func UtilSendResponse(w http.ResponseWriter, code int, response interface{}) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(response)
}

func UtilHashString(text string) (string, error) {
	hasher := sha256.New()
	_, err := hasher.Write([]byte(text))

	if err != nil {
		return "", err
	}

	return hex.EncodeToString(hasher.Sum(nil)), nil
}

func UtilCheckEtag(etag string, resourceIdentifier string) (bool, error) {
	hashedResource, err := UtilHashString(resourceIdentifier)
	if err != nil {
		return false, err
	}

	return hashedResource == etag, nil
}

func UtilEnableCors(w http.ResponseWriter) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
}
